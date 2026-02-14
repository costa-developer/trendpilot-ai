import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Target, AlertTriangle } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";

const trendingTopics = [
  { topic: "AI Agents for Creators", trendScore: 92, velocity: 88, opportunity: 95, status: "🔥 Hot" },
  { topic: "YouTube Shorts Monetization", trendScore: 85, velocity: 72, opportunity: 78, status: "📈 Rising" },
  { topic: "MrBeast Production Secrets", trendScore: 78, velocity: 65, opportunity: 60, status: "📈 Rising" },
  { topic: "Faceless YouTube Channels", trendScore: 74, velocity: 82, opportunity: 70, status: "🔥 Hot" },
  { topic: "Creator Economy 2026", trendScore: 68, velocity: 55, opportunity: 82, status: "📈 Rising" },
];

const contentGaps = [
  { topic: "AI Video Editing Tools", yourCoverage: "None", competition: "Medium", potential: "High" },
  { topic: "Shorts Strategy Deep-dive", yourCoverage: "1 video", competition: "Low", potential: "Very High" },
  { topic: "Revenue Diversification", yourCoverage: "None", competition: "Low", potential: "High" },
  { topic: "Community Building Tactics", yourCoverage: "2 videos", competition: "Medium", potential: "Medium" },
];

const Trends = () => (
  <div className="min-h-screen px-6 py-8">
    <div className="container mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Trend Insights</h1>
      <p className="mt-1 text-muted-foreground">Discover what's trending in your niche and find content opportunities.</p>

      {/* Trending Topics */}
      <div className="mt-8 space-y-4">
        {trendingTopics.map((t) => (
          <Card key={t.topic} className="border-0 bg-card p-6 shadow-card">
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
              <div className="flex items-center gap-8">
                <ScoreRing score={t.trendScore} label="Trend" size={80} strokeWidth={6} />
                <ScoreRing score={t.velocity} label="Velocity" size={80} strokeWidth={6} />
                <ScoreRing score={t.opportunity} label="Opportunity" size={80} strokeWidth={6} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Gaps */}
      <Card className="mt-8 border-0 bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Content Gaps</h3>
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
              {contentGaps.map((g) => (
                <tr key={g.topic} className="border-b border-border/50 last:border-0">
                  <td className="py-3.5 font-medium">{g.topic}</td>
                  <td className="py-3.5 text-muted-foreground">{g.yourCoverage}</td>
                  <td className="py-3.5">
                    <Badge variant="secondary" className="text-xs">{g.competition}</Badge>
                  </td>
                  <td className="py-3.5">
                    <Badge variant={g.potential.includes("High") ? "default" : "secondary"} className="text-xs">
                      {g.potential}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
);

export default Trends;
