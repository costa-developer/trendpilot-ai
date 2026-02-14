import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lightbulb, Type, Hash, FileText, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

const videoIdeas = [
  { title: "I Let AI Run My YouTube Channel for 30 Days — Here's What Happened", viral: 92 },
  { title: "The $0 YouTube Setup That Beats $5,000 Gear", viral: 87 },
  { title: "5 YouTube Shorts Tricks That Got Me 1M Views", viral: 85 },
  { title: "Why 99% of YouTubers Fail (And How to Fix It)", viral: 83 },
  { title: "I Tested Every AI Thumbnail Tool — Best One Wins", viral: 80 },
  { title: "How to Get Your First 1,000 Subscribers in 2026", viral: 78 },
  { title: "YouTube's Secret Algorithm Change Nobody Talks About", viral: 76 },
  { title: "Building a Faceless Channel That Makes $10K/Month", viral: 74 },
  { title: "The Posting Schedule That Tripled My Views", viral: 71 },
  { title: "I Reverse-Engineered MrBeast's Thumbnails", viral: 69 },
];

const sampleTitles = [
  "🚀 I Used AI to Predict My Next Viral Video (It Actually Worked)",
  "⚡ 7 YouTube Growth Hacks Nobody Is Talking About in 2026",
  "🎯 How I Got 500K Views With ZERO Subscribers",
  "💡 The ONE Change That 10x'd My YouTube Revenue",
  "🔥 YouTube Shorts vs Long-Form: The Data-Driven Answer",
];

const sampleHashtags = [
  "#YouTubeGrowth", "#ContentCreator", "#YouTubeTips", "#AITools", "#YouTubeAlgorithm",
  "#CreatorEconomy", "#VideoMarketing", "#YouTubeShorts", "#GrowOnYouTube", "#ContentStrategy",
  "#ViralVideo", "#YouTubeSEO", "#CreatorTips", "#SocialMediaGrowth", "#TrendPilot",
];

const scriptOutline = {
  hook: "\"What if I told you AI could predict your next viral video before you even film it? I tested this for 30 days, and the results blew my mind...\"",
  problem: "Most creators waste hours guessing what content to make. They follow outdated advice, copy competitors blindly, and wonder why their views are stuck.",
  value: "Today I'm sharing the exact AI-powered system I used to triple my views in 30 days. I'll show you the 3 tools, the strategy, and the data behind every decision.",
  example: "Walk through a live demo of analyzing a channel, finding trending topics, and generating an optimized video plan using TrendPilot AI.",
  cta: "If you want to try this system yourself, link is in the description. Drop a comment with your niche and I'll tell you the #1 trending topic you should cover next.",
};

const Generator = () => {
  const [activeTab, setActiveTab] = useState("ideas");

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">AI Content Generator</h1>
            <p className="text-muted-foreground">AI-powered content ideas, titles, hashtags, and scripts.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="bg-card shadow-card border-0 p-1">
            <TabsTrigger value="ideas" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lightbulb className="h-4 w-4" /> Video Ideas
            </TabsTrigger>
            <TabsTrigger value="titles" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Type className="h-4 w-4" /> Titles
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Hash className="h-4 w-4" /> Hashtags
            </TabsTrigger>
            <TabsTrigger value="script" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" /> Script
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">10 Trending Video Ideas</h3>
              <Button variant="outline" size="sm" className="gap-2"><RefreshCw className="h-3.5 w-3.5" /> Regenerate</Button>
            </div>
            <div className="space-y-3">
              {videoIdeas.map((idea, i) => (
                <Card key={i} className="flex items-center justify-between border-0 bg-card p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-xs font-bold text-primary">{i + 1}</span>
                    <span className="text-sm font-medium">{idea.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">🔥 {idea.viral}%</Badge>
                    <Button variant="ghost" size="sm"><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="titles" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">High-CTR Titles</h3>
              <Button variant="outline" size="sm" className="gap-2"><RefreshCw className="h-3.5 w-3.5" /> Regenerate</Button>
            </div>
            <div className="space-y-3">
              {sampleTitles.map((title, i) => (
                <Card key={i} className="flex items-center justify-between border-0 bg-card p-4 shadow-card">
                  <span className="text-sm font-medium">{title}</span>
                  <Button variant="ghost" size="sm"><Copy className="h-3.5 w-3.5" /></Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-6">
            <Card className="border-0 bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">SEO Optimized Hashtags</h3>
                <Button variant="outline" size="sm" className="gap-2"><Copy className="h-3.5 w-3.5" /> Copy All</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleHashtags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer px-3 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="script" className="mt-6">
            <Card className="border-0 bg-card p-6 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold">Script Outline</h3>
                <Button variant="outline" size="sm" className="gap-2"><RefreshCw className="h-3.5 w-3.5" /> Regenerate</Button>
              </div>
              <div className="space-y-6">
                {Object.entries(scriptOutline).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-background p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="text-xs capitalize">{key === "cta" ? "Call to Action" : key}</Badge>
                      {key === "hook" && <span className="text-xs text-muted-foreground">0–15 seconds</span>}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Generator;
