import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const topicPerformance = [
  { topic: "AI Tools", avgViews: 85000, videos: 12 },
  { topic: "Tutorials", avgViews: 62000, videos: 18 },
  { topic: "Reviews", avgViews: 48000, videos: 15 },
  { topic: "Vlogs", avgViews: 21000, videos: 8 },
  { topic: "Collabs", avgViews: 73000, videos: 5 },
];

const titlePatterns = [
  { pattern: "Numbers in title (\"10 Best...\")", effectiveness: "High", ctr: "8.2%", icon: TrendingUp },
  { pattern: "Question format (\"How to...\")", effectiveness: "High", ctr: "7.5%", icon: TrendingUp },
  { pattern: "Emotional hooks (\"SHOCKING\")", effectiveness: "Medium", ctr: "6.1%", icon: Minus },
  { pattern: "Simple descriptive", effectiveness: "Low", ctr: "3.8%", icon: TrendingDown },
];

const categoryData = [
  { name: "AI & Tech", value: 40 },
  { name: "Tutorials", value: 30 },
  { name: "Reviews", value: 20 },
  { name: "Other", value: 10 },
];
const COLORS = [
  "hsl(358, 28%, 21%)",
  "hsl(17, 43%, 84%)",
  "hsl(210, 2%, 35%)",
  "hsl(23, 50%, 91%)",
];

const Analysis = () => (
  <div className="min-h-screen px-6 py-8">
    <div className="container mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Channel Analysis</h1>
      <p className="mt-1 text-muted-foreground">Deep-dive into content performance and patterns.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Topic Performance */}
        <Card className="border-0 bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold">Topic Performance</h3>
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
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
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
          {titlePatterns.map((p) => (
            <div key={p.pattern} className="flex items-center justify-between rounded-lg bg-background p-4">
              <div className="flex items-center gap-3">
                <p.icon className={`h-5 w-5 ${p.effectiveness === "High" ? "text-green-600" : p.effectiveness === "Low" ? "text-red-500" : "text-yellow-500"}`} />
                <span className="text-sm font-medium">{p.pattern}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={p.effectiveness === "High" ? "default" : "secondary"} className="text-xs">
                  {p.effectiveness}
                </Badge>
                <span className="text-sm font-semibold text-primary">{p.ctr} CTR</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

export default Analysis;
