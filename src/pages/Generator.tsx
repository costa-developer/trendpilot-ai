import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lightbulb, Type, Hash, FileText, Copy, RefreshCw, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { useChannelData } from "@/hooks/useChannelData";
import UpgradePrompt from "@/components/UpgradePrompt";
import { useNavigate } from "react-router-dom";

const Generator = () => {
  const { currentPlan, isActive } = useSubscription();
  const isPro = currentPlan !== "free" && isActive;
  const { channelContext, hasData } = useChannelData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ideas");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [script, setScript] = useState<any>(null);

  const generate = async (type: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          type,
          channelData: channelContext
            ? {
                channelTitle: channelContext.channelTitle,
                subscriberCount: channelContext.subscriberCount,
                avgViews: channelContext.avgViews,
                engagementRate: channelContext.engagementRate,
                topVideos: channelContext.topVideos?.slice(0, 5),
              }
            : undefined,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const result = data.result;
      if (type === "ideas") setIdeas(Array.isArray(result) ? result : []);
      else if (type === "titles") setTitles(Array.isArray(result) ? result : []);
      else if (type === "hashtags") setHashtags(Array.isArray(result) ? result : []);
      else if (type === "script") setScript(typeof result === "object" ? result : null);

      toast.success("Content generated!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/50">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">AI Content Generator</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {hasData
                ? `AI-powered content tailored to ${channelContext!.channelTitle}.`
                : "AI-powered content ideas, titles, hashtags, and scripts."}
            </p>
          </div>
        </div>

        {!isPro ? (
          <div className="mt-8">
            <UpgradePrompt feature="AI Content Generator" description="Generate unlimited video ideas, optimized titles, hashtags, and full script outlines with Pro." />
          </div>
        ) : !hasData ? (
          <Card className="mt-8 border-0 bg-card p-12 text-center shadow-card">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">Analyze a Channel First</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Go to the Dashboard and analyze your YouTube channel so the AI can generate personalized content for you.
            </p>
            <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </Card>
        ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="flex h-auto flex-wrap bg-card shadow-card border-0 p-1">
            <TabsTrigger value="ideas" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:gap-2 sm:text-sm">
              <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Ideas
            </TabsTrigger>
            <TabsTrigger value="titles" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:gap-2 sm:text-sm">
              <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Titles
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:gap-2 sm:text-sm">
              <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Hashtags
            </TabsTrigger>
            <TabsTrigger value="script" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:gap-2 sm:text-sm">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Script
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Video Ideas for {channelContext!.channelTitle}</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => generate("ideas")} disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Generate
              </Button>
            </div>
            {ideas.length === 0 && !loading && (
              <Card className="border-0 bg-card p-8 text-center shadow-card">
                <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">Click "Generate" to get AI-powered video ideas based on your channel.</p>
              </Card>
            )}
            <div className="space-y-3">
              {ideas.map((idea, i) => (
                <Card key={i} className="flex flex-col gap-3 border-0 bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-xs font-bold text-primary">{i + 1}</span>
                    <span className="text-sm font-medium line-clamp-2">{idea.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {idea.viral && <Badge variant="secondary" className="text-xs">🔥 {idea.viral}%</Badge>}
                    <Button variant="ghost" size="sm" onClick={() => copyText(idea.title)}><Copy className="h-3.5 w-3.5" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="titles" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">High-CTR Titles for {channelContext!.channelTitle}</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => generate("titles")} disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Generate
              </Button>
            </div>
            {titles.length === 0 && !loading && (
              <Card className="border-0 bg-card p-8 text-center shadow-card"><p className="text-sm text-muted-foreground">Click "Generate" to get optimized titles for your channel.</p></Card>
            )}
            <div className="space-y-3">
              {titles.map((title, i) => (
                <Card key={i} className="flex items-center justify-between border-0 bg-card p-4 shadow-card">
                  <span className="text-sm font-medium">{title}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyText(title)}><Copy className="h-3.5 w-3.5" /></Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hashtags" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">SEO Hashtags for {channelContext!.channelTitle}</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => generate("hashtags")} disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Generate
              </Button>
            </div>
            {hashtags.length === 0 && !loading ? (
              <Card className="border-0 bg-card p-8 text-center shadow-card"><p className="text-sm text-muted-foreground">Click "Generate" to get hashtags tailored to your channel.</p></Card>
            ) : (
              <Card className="border-0 bg-card p-6 shadow-card">
                <div className="mb-3 flex justify-end">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => copyText(hashtags.join(" "))}><Copy className="h-3.5 w-3.5" /> Copy All</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground" onClick={() => copyText(tag)}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="script" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Script for {channelContext!.channelTitle}</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => generate("script")} disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Generate
              </Button>
            </div>
            {!script && !loading && (
              <Card className="border-0 bg-card p-8 text-center shadow-card"><p className="text-sm text-muted-foreground">Click "Generate" to get a personalized script outline.</p></Card>
            )}
            {script && (
              <Card className="border-0 bg-card p-6 shadow-card">
                <div className="space-y-6">
                  {Object.entries(script).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-background p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge className="text-xs capitalize">{key === "cta" ? "Call to Action" : key}</Badge>
                        {key === "hook" && <span className="text-xs text-muted-foreground">0–15 seconds</span>}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{value as string}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
};

export default Generator;
