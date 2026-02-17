import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus, Loader2, Search } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useChannelData } from "@/hooks/useChannelData";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const titlePatterns = [
  { pattern: "Numbers in title (\"10 Best...\")", effectiveness: "High", ctr: "8.2%", icon: TrendingUp },
  { pattern: "Question format (\"How to...\")", effectiveness: "High", ctr: "7.5%", icon: TrendingUp },
  { pattern: "Emotional hooks (\"SHOCKING\")", effectiveness: "Medium", ctr: "6.1%", icon: Minus },
  { pattern: "Simple descriptive", effectiveness: "Low", ctr: "3.8%", icon: TrendingDown },
];

const COLORS = [
  "hsl(358, 28%, 21%)",
  "hsl(17, 43%, 84%)",
  "hsl(210, 2%, 35%)",
  "hsl(23, 50%, 91%)",
];

const Analysis = () => {
  const { currentPlan, isActive } = useSubscription();
  const isPro = currentPlan !== "free" && isActive;
  const { channelContext, hasData, isLoading } = useChannelData();
  const navigate = useNavigate();

  // Build topic performance from user's video data
  const topicPerformance = useMemo(() => {
    if (!channelContext?.videos?.length) return [];
    const topics: Record<string, { totalViews: number; count: number }> = {};
    channelContext.videos.forEach((v) => {
      // Simple categorization based on title keywords
      let topic = "Other";
      const t = v.title.toLowerCase();
      if (t.includes("tutorial") || t.includes("how to") || t.includes("guide")) topic = "Tutorials";
      else if (t.includes("review") || t.includes("unbox")) topic = "Reviews";
      else if (t.includes("ai") || t.includes("tech") || t.includes("tool")) topic = "AI & Tech";
      else if (t.includes("vlog") || t.includes("day in")) topic = "Vlogs";
      else if (t.includes("top") || t.includes("best") || t.includes("worst")) topic = "Lists";
      
      if (!topics[topic]) topics[topic] = { totalViews: 0, count: 0 };
      topics[topic].totalViews += v.views;
      topics[topic].count += 1;
    });
    return Object.entries(topics)
      .map(([topic, data]) => ({
        topic,
        avgViews: Math.round(data.totalViews / data.count),
        videos: data.count,
      }))
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 5);
  }, [channelContext]);

  const categoryData = useMemo(() => {
    if (!topicPerformance.length) return [];
    const total = topicPerformance.reduce((s, t) => s + t.videos, 0);
    return topicPerformance.map((t) => ({
      name: t.topic,
      value: Math.round((t.videos / total) * 100),
    }));
  }, [topicPerformance]);

  // Analyze title patterns from user's actual videos
  const userTitlePatterns = useMemo(() => {
    if (!channelContext?.videos?.length) return titlePatterns;
    const patterns = [
      { pattern: "Numbers in title", regex: /\d+/, videos: [] as any[] },
      { pattern: "Question format", regex: /\b(how|why|what|when|can|do|does|is|are)\b/i, videos: [] as any[] },
      { pattern: "Emotional hooks", regex: /\b(shocking|insane|unbelievable|amazing|incredible|worst|best)\b/i, videos: [] as any[] },
      { pattern: "Simple descriptive", regex: /^[a-zA-Z\s]+$/i, videos: [] as any[] },
    ];
    channelContext.videos.forEach((v) => {
      patterns.forEach((p) => {
        if (p.regex.test(v.title)) p.videos.push(v);
      });
    });
    return patterns.map((p) => {
      const avgViews = p.videos.length > 0 ? p.videos.reduce((s, v) => s + v.views, 0) / p.videos.length : 0;
      const overallAvg = channelContext.avgViews || 1;
      const ratio = avgViews / overallAvg;
      const effectiveness = ratio > 1.2 ? "High" : ratio > 0.8 ? "Medium" : "Low";
      const ctr = p.videos.length > 0 ? `${p.videos.length} videos` : "0 videos";
      return {
        pattern: p.pattern,
        effectiveness,
        ctr,
        icon: effectiveness === "High" ? TrendingUp : effectiveness === "Low" ? TrendingDown : Minus,
      };
    });
  }, [channelContext]);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold">Channel Analysis</h1>
        <p className="mt-1 text-muted-foreground">
          {hasData
            ? `Deep-dive into ${channelContext!.channelTitle}'s content performance.`
            : "Deep-dive into content performance and patterns."}
        </p>

        {!isPro ? (
          <div className="mt-8">
            <UpgradePrompt feature="Channel Analysis" description="Get deep-dive analytics on topic performance, content distribution, and title patterns with a Pro plan." />
          </div>
        ) : isLoading ? (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !hasData ? (
          <Card className="mt-8 border-0 bg-card p-12 text-center shadow-card">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">No Channel Data Yet</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Analyze a YouTube channel on the Dashboard first, then come back here for a deep-dive analysis.
            </p>
            <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        ) : (
          <>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Topic Performance */}
              <Card className="border-0 bg-card p-6 shadow-card">
                <h3 className="mb-4 text-lg font-bold">Topic Performance — {channelContext!.channelTitle}</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topicPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis dataKey="topic" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "8px", boxShadow: "var(--shadow-elevated)" }} />
                    <Bar dataKey="avgViews" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Content Distribution */}
              <Card className="border-0 bg-card p-6 shadow-card">
                <h3 className="mb-4 text-lg font-bold">Content Distribution</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                        {categoryData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "none", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-4">
                  {categoryData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Title Patterns */}
            <Card className="mt-6 border-0 bg-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-bold">Title Pattern Analysis</h3>
              <div className="space-y-3">
                {userTitlePatterns.map((p) => (
                  <div key={p.pattern} className="flex flex-col gap-2 rounded-lg bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <p.icon className={`h-5 w-5 shrink-0 ${p.effectiveness === "High" ? "text-green-600" : p.effectiveness === "Low" ? "text-red-500" : "text-yellow-500"}`} />
                      <span className="text-sm font-medium">{p.pattern}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={p.effectiveness === "High" ? "default" : "secondary"} className="text-xs">
                        {p.effectiveness}
                      </Badge>
                      <span className="text-sm font-semibold text-primary">{p.ctr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;
