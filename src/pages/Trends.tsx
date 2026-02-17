import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Target, Loader2, Search } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { useChannelData } from "@/hooks/useChannelData";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useNavigate } from "react-router-dom";

const Trends = () => {
  const { currentPlan, isActive } = useSubscription();
  const isPro = currentPlan !== "free" && isActive;
  const { channelContext, hasData } = useChannelData();
  const navigate = useNavigate();
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [contentGaps, setContentGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const channelPayload = channelContext
    ? {
        channelTitle: channelContext.channelTitle,
        subscriberCount: channelContext.subscriberCount,
        avgViews: channelContext.avgViews,
        engagementRate: channelContext.engagementRate,
        topVideos: channelContext.topVideos?.slice(0, 5),
      }
    : undefined;

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const [trendsRes, gapsRes] = await Promise.all([
        supabase.functions.invoke("generate-content", { body: { type: "trends", channelData: channelPayload } }),
        supabase.functions.invoke("generate-content", { body: { type: "gaps", channelData: channelPayload } }),
      ]);

      if (trendsRes.data?.result) setTrendingTopics(Array.isArray(trendsRes.data.result) ? trendsRes.data.result : []);
      if (gapsRes.data?.result) setContentGaps(Array.isArray(gapsRes.data.result) ? gapsRes.data.result : []);
      toast.success("Trend insights generated!");
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch trends");
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Trend Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">Discover what's trending and find content opportunities.</p>
          <div className="mt-8">
            <UpgradePrompt feature="Trend Insights" description="Unlock AI-powered trend detection, content gap analysis, and opportunity scoring with Pro." />
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Trend Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">Discover what's trending and find content opportunities.</p>
          <Card className="mt-8 border-0 bg-card p-12 text-center shadow-card">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">Analyze a Channel First</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Go to the Dashboard and analyze your YouTube channel so we can find trends relevant to your niche.
            </p>
            <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Trend Insights</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Trends and opportunities for {channelContext!.channelTitle}.
            </p>
          </div>
          <Button onClick={fetchTrends} disabled={loading} className="w-full gap-2 font-semibold sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
            {trendingTopics.length > 0 ? "Refresh" : "Generate Insights"}
          </Button>
        </div>

        {trendingTopics.length === 0 && !loading && (
          <Card className="mt-8 border-0 bg-card p-12 text-center shadow-card">
            <Flame className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">No Trends Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click "Generate Insights" to discover trending topics for your channel.</p>
          </Card>
        )}

        {loading && (
          <Card className="mt-8 border-0 bg-card p-12 text-center shadow-card">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Analyzing trends for {channelContext!.channelTitle}...</p>
          </Card>
        )}

        {trendingTopics.length > 0 && (
          <div className="mt-8 space-y-4">
            {trendingTopics.map((t, i) => (
              <Card key={i} className="border-0 bg-card p-6 shadow-card">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                      <Flame className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.topic}</h3>
                      <span className="text-sm text-muted-foreground">{t.status}</span>
                    </div>
                  </div>
                   <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                     <ScoreRing score={t.trendScore} label="Trend" size={80} strokeWidth={6} />
                     <ScoreRing score={t.velocity} label="Velocity" size={80} strokeWidth={6} />
                     <ScoreRing score={t.opportunity} label="Opportunity" size={80} strokeWidth={6} />
                   </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {contentGaps.length > 0 && (
          <Card className="mt-8 border-0 bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Content Gaps for {channelContext!.channelTitle}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left font-semibold text-muted-foreground">Topic</th>
                    <th className="pb-3 text-left font-semibold text-muted-foreground">Your Coverage</th>
                    <th className="pb-3 text-left font-semibold text-muted-foreground">Competition</th>
                    <th className="pb-3 text-left font-semibold text-muted-foreground">Potential</th>
                  </tr>
                </thead>
                <tbody>
                  {contentGaps.map((g, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-3.5 font-medium">{g.topic}</td>
                      <td className="py-3.5 text-muted-foreground">{g.yourCoverage}</td>
                      <td className="py-3.5"><Badge variant="secondary" className="text-xs">{g.competition}</Badge></td>
                      <td className="py-3.5">
                        <Badge variant={String(g.potential).includes("High") ? "default" : "secondary"} className="text-xs">{g.potential}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Trends;
