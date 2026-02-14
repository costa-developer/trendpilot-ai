import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/MetricCard";
import ScoreRing from "@/components/ScoreRing";
import { Eye, ThumbsUp, Users, Clock, Search, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [channelUrl, setChannelUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const analyzeChannel = async () => {
    if (!channelUrl.trim()) {
      toast.error("Please enter a YouTube channel URL");
      return;
    }
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("analyze-channel", {
        body: { channelUrl },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setData(result);

      // Save analysis
      if (user) {
        await supabase.from("analyses").insert({
          user_id: user.id,
          channel_url: channelUrl,
          channel_id: result.channelId,
          channel_title: result.channelTitle,
          subscriber_count: result.subscriberCount,
          video_count: result.videoCount,
          view_count: result.totalViewCount,
          analysis_data: result as any,
        });
      }
      toast.success(`Analyzed "${result.channelTitle}" successfully!`);
    } catch (e: any) {
      toast.error(e.message || "Failed to analyze channel");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  // Prepare chart data from videos
  const chartData = data?.videos
    ? data.videos.slice(0, 20).reverse().map((v: any, i: number) => ({
        name: `V${i + 1}`,
        views: v.views,
      }))
    : [];

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Paste a YouTube channel URL to start analyzing.</p>
          <div className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="https://youtube.com/@channel"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                className="h-12 border-0 bg-card pl-10 shadow-card"
                onKeyDown={(e) => e.key === "Enter" && analyzeChannel()}
              />
            </div>
            <Button className="h-12 px-6 font-semibold" onClick={analyzeChannel} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
            </Button>
          </div>
        </div>

        {!data && !loading && (
          <Card className="border-0 bg-card p-12 text-center shadow-card">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">No Analysis Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Enter a YouTube channel URL above to get started.</p>
          </Card>
        )}

        {loading && (
          <Card className="border-0 bg-card p-12 text-center shadow-card">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h3 className="mt-4 text-lg font-semibold">Analyzing Channel...</h3>
            <p className="mt-1 text-sm text-muted-foreground">Fetching data from YouTube API. This may take a moment.</p>
          </Card>
        )}

        {data && (
          <>
            {/* Channel info */}
            <Card className="mb-6 flex items-center gap-4 border-0 bg-card p-6 shadow-card">
              {data.thumbnailUrl && (
                <img src={data.thumbnailUrl} alt={data.channelTitle} className="h-16 w-16 rounded-full" />
              )}
              <div>
                <h2 className="text-xl font-bold">{data.channelTitle}</h2>
                <p className="text-sm text-muted-foreground line-clamp-1">{data.channelDescription}</p>
              </div>
            </Card>

            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard icon={Eye} title="Avg. Views" value={formatNumber(data.avgViews)} change={`${data.totalVideosAnalyzed} videos analyzed`} changeType="neutral" />
              <MetricCard icon={ThumbsUp} title="Engagement Rate" value={`${data.engagementRate}%`} />
              <MetricCard icon={Users} title="Subscribers" value={formatNumber(data.subscriberCount)} />
              <MetricCard icon={Clock} title="Total Videos" value={formatNumber(data.videoCount)} />
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <Card className="mt-8 border-0 bg-card p-6 shadow-card">
                <h3 className="mb-4 text-lg font-bold">Recent Video Views</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "8px", boxShadow: "var(--shadow-elevated)" }} />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Top Videos */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <Card className="border-0 bg-card p-6 shadow-card">
                <h3 className="mb-6 text-lg font-bold">Scores</h3>
                <div className="grid grid-cols-2 gap-6">
                  <ScoreRing score={Math.min(100, Math.round(data.engagementRate * 10))} label="Viral Potential" />
                  <ScoreRing score={Math.min(100, Math.round(data.subscriberCount / 10000))} label="Growth Score" />
                </div>
              </Card>
              <Card className="border-0 bg-card p-6 shadow-card lg:col-span-2">
                <h3 className="mb-4 text-lg font-bold">Top Performing Videos</h3>
                <div className="space-y-3">
                  {(data.topVideos || []).map((v: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-background p-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/50 text-xs font-bold text-primary">{i + 1}</span>
                        <span className="text-sm font-medium line-clamp-1">{v.title}</span>
                      </div>
                      <span className="shrink-0 text-sm text-muted-foreground">{formatNumber(v.views)} views</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
