import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/MetricCard";
import ScoreRing from "@/components/ScoreRing";
import { Eye, ThumbsUp, MessageSquare, TrendingUp, Users, Clock, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";

const viewsData = [
  { name: "Jan", views: 12400 },
  { name: "Feb", views: 18200 },
  { name: "Mar", views: 15600 },
  { name: "Apr", views: 22100 },
  { name: "May", views: 28900 },
  { name: "Jun", views: 25300 },
  { name: "Jul", views: 34200 },
  { name: "Aug", views: 31800 },
];

const engagementData = [
  { name: "Jan", rate: 4.2 },
  { name: "Feb", rate: 5.1 },
  { name: "Mar", rate: 4.8 },
  { name: "Apr", rate: 6.3 },
  { name: "May", rate: 7.1 },
  { name: "Jun", rate: 6.8 },
  { name: "Jul", rate: 8.2 },
  { name: "Aug", rate: 7.9 },
];

const topVideos = [
  { title: "10 AI Tools You NEED in 2026", views: "124K", engagement: "8.4%" },
  { title: "How I Grew 50K Subs in 90 Days", views: "98K", engagement: "7.2%" },
  { title: "YouTube Algorithm Secrets Revealed", views: "87K", engagement: "9.1%" },
  { title: "Best Camera Setup Under $500", views: "65K", engagement: "6.5%" },
  { title: "My Honest Review: Creator Economy", views: "52K", engagement: "5.8%" },
];

const Dashboard = () => {
  const [channelUrl, setChannelUrl] = useState("");

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Search */}
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
                className="pl-10 bg-card border-0 shadow-card h-12"
              />
            </div>
            <Button className="h-12 px-6 font-semibold">Analyze</Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Eye} title="Avg. Views" value="24.3K" change="+12.5% vs last month" changeType="positive" />
          <MetricCard icon={ThumbsUp} title="Engagement Rate" value="7.2%" change="+0.8%" changeType="positive" />
          <MetricCard icon={Users} title="Subscribers" value="142K" change="+2.3K this week" changeType="positive" />
          <MetricCard icon={Clock} title="Upload Freq." value="3.2/wk" change="Consistent" changeType="neutral" />
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-0 bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold">Views Over Time</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-elevated)",
                  }}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="border-0 bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold">Engagement Rate</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-elevated)",
                  }}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--chart-2))" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Scores + Top Videos */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="border-0 bg-card p-6 shadow-card">
            <h3 className="mb-6 text-lg font-bold">Scores</h3>
            <div className="grid grid-cols-2 gap-6">
              <ScoreRing score={78} label="Viral Potential" />
              <ScoreRing score={45} label="Niche Saturation" />
              <ScoreRing score={62} label="Competition" />
              <ScoreRing score={85} label="Growth Score" />
            </div>
          </Card>
          <Card className="border-0 bg-card p-6 shadow-card lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold">Top Performing Videos</h3>
            <div className="space-y-3">
              {topVideos.map((v, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-background p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/50 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{v.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{v.views} views</span>
                    <span className="font-medium text-primary">{v.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
