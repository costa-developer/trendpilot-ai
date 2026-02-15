import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Lightbulb,
  Loader2,
  MapPin,
  Megaphone,
  Rocket,
  Target,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Phase = "foundation" | "momentum" | "scale";

interface RoadmapDay {
  day: number;
  phase: Phase;
  title: string;
  tasks: string[];
  contentType?: string;
  postTime?: string;
}

const PHASES: { id: Phase; label: string; icon: React.ElementType; range: string; color: string }[] = [
  { id: "foundation", label: "Foundation", icon: MapPin, range: "Days 1–10", color: "bg-primary" },
  { id: "momentum", label: "Momentum", icon: Flame, range: "Days 11–20", color: "bg-accent" },
  { id: "scale", label: "Scale", icon: Rocket, range: "Days 21–30", color: "bg-secondary" },
];

const DEFAULT_ROADMAP: RoadmapDay[] = [
  { day: 1, phase: "foundation", title: "Channel Audit", tasks: ["Review channel analytics", "Identify top 5 performing videos", "Note content gaps"], contentType: "Research", postTime: "—" },
  { day: 2, phase: "foundation", title: "Competitor Research", tasks: ["Find 3 competitor channels", "Analyze their top 10 videos", "List winning title patterns"], contentType: "Research", postTime: "—" },
  { day: 3, phase: "foundation", title: "Niche Keywords", tasks: ["Brainstorm 20 seed keywords", "Use YouTube search suggestions", "Prioritize by competition"], contentType: "SEO", postTime: "—" },
  { day: 4, phase: "foundation", title: "Content Pillars", tasks: ["Define 3–4 content pillars", "Map pillar ➔ audience need", "Plan first video per pillar"], contentType: "Strategy", postTime: "—" },
  { day: 5, phase: "foundation", title: "Video 1 — Script", tasks: ["Pick highest-opportunity topic", "Write hook + outline", "Draft full script"], contentType: "Long-form", postTime: "10:00 AM" },
  { day: 6, phase: "foundation", title: "Video 1 — Film & Edit", tasks: ["Record A-roll & B-roll", "Edit with strong pacing", "Add captions & graphics"], contentType: "Production", postTime: "—" },
  { day: 7, phase: "foundation", title: "Video 1 — Publish", tasks: ["Optimize title & thumbnail", "Write keyword-rich description", "Promote in 2 communities"], contentType: "Long-form", postTime: "2:00 PM" },
  { day: 8, phase: "foundation", title: "Short 1 — Quick Win", tasks: ["Repurpose best clip from Video 1", "Add subtitles & hook text", "Post as YouTube Short"], contentType: "Short", postTime: "12:00 PM" },
  { day: 9, phase: "foundation", title: "Engage & Respond", tasks: ["Reply to every comment", "Comment on 5 related videos", "Pin a question for engagement"], contentType: "Community", postTime: "—" },
  { day: 10, phase: "foundation", title: "Week 1 Review", tasks: ["Check analytics dashboard", "Note CTR & retention", "Adjust strategy based on data"], contentType: "Review", postTime: "—" },

  { day: 11, phase: "momentum", title: "Video 2 — Script", tasks: ["Use trending topic from research", "Apply winning title formula", "Write punchy hook"], contentType: "Long-form", postTime: "10:00 AM" },
  { day: 12, phase: "momentum", title: "Video 2 — Film & Edit", tasks: ["Try a new editing style", "Improve audio quality", "Add pattern interrupts"], contentType: "Production", postTime: "—" },
  { day: 13, phase: "momentum", title: "Video 2 — Publish", tasks: ["A/B test two thumbnails", "Schedule at peak time", "Cross-post teaser on social"], contentType: "Long-form", postTime: "2:00 PM" },
  { day: 14, phase: "momentum", title: "Short 2 + Community", tasks: ["Create second Short", "Post a community poll", "Reply to new comments"], contentType: "Short", postTime: "12:00 PM" },
  { day: 15, phase: "momentum", title: "Collab Outreach", tasks: ["List 5 potential collabs", "Send personalized DMs", "Propose mutual value"], contentType: "Networking", postTime: "—" },
  { day: 16, phase: "momentum", title: "Video 3 — Script", tasks: ["Address a common pain point", "Use curiosity-gap title", "Plan strong CTA"], contentType: "Long-form", postTime: "10:00 AM" },
  { day: 17, phase: "momentum", title: "Video 3 — Film & Edit", tasks: ["Film with improved lighting", "Tighten to < 10 min", "Add end screen"], contentType: "Production", postTime: "—" },
  { day: 18, phase: "momentum", title: "Video 3 — Publish", tasks: ["Optimize for suggested videos", "Use playlist strategy", "Engage in first hour"], contentType: "Long-form", postTime: "2:00 PM" },
  { day: 19, phase: "momentum", title: "SEO Optimization Pass", tasks: ["Update older video descriptions", "Add cards to new videos", "Create a best-of playlist"], contentType: "SEO", postTime: "—" },
  { day: 20, phase: "momentum", title: "Week 2–3 Review", tasks: ["Compare growth metrics", "Identify best-performing content", "Double down on what works"], contentType: "Review", postTime: "—" },

  { day: 21, phase: "scale", title: "Video 4 — Viral Attempt", tasks: ["Pick highest viral-potential idea", "Craft irresistible thumbnail", "Write emotional hook"], contentType: "Long-form", postTime: "2:00 PM" },
  { day: 22, phase: "scale", title: "Short 3 + Short 4", tasks: ["Create two Shorts from Video 4", "Test different aspect ratios", "Optimize first 2 seconds"], contentType: "Short", postTime: "12:00 PM" },
  { day: 23, phase: "scale", title: "Email List Setup", tasks: ["Create lead magnet PDF", "Add link to descriptions", "Set up welcome email"], contentType: "Funnel", postTime: "—" },
  { day: 24, phase: "scale", title: "Video 5 — Evergreen", tasks: ["Pick search-friendly topic", "Create comprehensive guide", "Target long-tail keyword"], contentType: "Long-form", postTime: "2:00 PM" },
  { day: 25, phase: "scale", title: "Batch Record", tasks: ["Script 3 future videos", "Film all in one session", "Prepare thumbnails"], contentType: "Production", postTime: "—" },
  { day: 26, phase: "scale", title: "Monetization Check", tasks: ["Review watch-hour progress", "Explore sponsorship decks", "Set up merch/store if ready"], contentType: "Revenue", postTime: "—" },
  { day: 27, phase: "scale", title: "Video 6 — Publish", tasks: ["Release next batch video", "Promote in newsletter", "Cross-post highlight reel"], contentType: "Long-form", postTime: "2:00 PM" },
  { day: 28, phase: "scale", title: "Community Deep Dive", tasks: ["Host a community Q&A post", "Create a poll about next topics", "Feature fan comment in video"], contentType: "Community", postTime: "—" },
  { day: 29, phase: "scale", title: "Analytics Deep Dive", tasks: ["Analyze 30-day retention curves", "Map traffic sources", "Identify top external referrers"], contentType: "Review", postTime: "—" },
  { day: 30, phase: "scale", title: "Plan Month 2", tasks: ["Set new subscriber target", "Schedule next 10 videos", "Celebrate your wins 🎉"], contentType: "Strategy", postTime: "—" },
];

const CONTENT_TYPE_ICON: Record<string, React.ElementType> = {
  "Long-form": Video,
  Short: Zap,
  Research: Target,
  SEO: TrendingUp,
  Strategy: Lightbulb,
  Production: Clock,
  Community: Megaphone,
  Review: CheckCircle2,
  Networking: Megaphone,
  Funnel: Rocket,
  Revenue: TrendingUp,
};

const Roadmap = () => {
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [personalizedRoadmap, setPersonalizedRoadmap] = useState<RoadmapDay[] | null>(null);

  const roadmap = personalizedRoadmap || DEFAULT_ROADMAP;
  const progress = Math.round((completedDays.size / 30) * 100);

  // Load saved progress from database
  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const { data } = await supabase
        .from("roadmap_progress")
        .select("completed_days")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.completed_days) {
        setCompletedDays(new Set(data.completed_days));
      }
    };
    load();
  }, [user?.id]);

  const saveProgress = async (days: Set<number>) => {
    if (!user?.id) return;
    const arr = [...days];
    const { data: existing } = await supabase
      .from("roadmap_progress")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("roadmap_progress")
        .update({ completed_days: arr, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("roadmap_progress")
        .insert({ user_id: user.id, completed_days: arr });
    }
  };

  const toggleDay = (day: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      saveProgress(next);
      return next;
    });
  };

  const generatePersonalized = async () => {
    setGenerating(true);
    try {
      // Get latest analysis for context
      const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      const channelData = analyses?.[0]?.analysis_data as any;

      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          type: "ideas",
          channelData: channelData
            ? {
                channelTitle: analyses?.[0]?.channel_title,
                subscriberCount: analyses?.[0]?.subscriber_count,
                avgViews: channelData?.avgViews,
                engagementRate: channelData?.engagementRate,
                topVideos: channelData?.topVideos?.slice(0, 5),
              }
            : undefined,
        },
      });

      if (error) throw error;
      toast.success("Personalized roadmap ideas generated! Check the AI Ideas tab.");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate personalized roadmap");
    } finally {
      setGenerating(false);
    }
  };

  const getDaysForPhase = (phase: Phase) => roadmap.filter((d) => d.phase === phase);
  const getPhaseProgress = (phase: Phase) => {
    const days = getDaysForPhase(phase);
    const done = days.filter((d) => completedDays.has(d.day)).length;
    return Math.round((done / days.length) * 100);
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">30-Day Growth Roadmap</h1>
          <p className="mt-1 text-muted-foreground">
            Your step-by-step plan to grow your YouTube channel in 30 days.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-0 bg-card shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Calendar className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                    <p className="font-display text-2xl font-bold">{completedDays.size}/30 days</p>
                  </div>
                </div>
                <Progress value={progress} className="mt-4 h-2.5" />
              </div>
              <Button
                onClick={generatePersonalized}
                disabled={generating}
                className="gap-2 font-semibold"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4" />
                )}
                Personalize with AI
              </Button>
            </div>

            {/* Phase Cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {PHASES.map((phase) => {
                const Icon = phase.icon;
                const phaseProgress = getPhaseProgress(phase.id);
                return (
                  <div
                    key={phase.id}
                    className="rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${phase.color}`}>
                        <Icon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{phase.label}</p>
                        <p className="text-xs text-muted-foreground">{phase.range}</p>
                      </div>
                    </div>
                    <Progress value={phaseProgress} className="mt-3 h-1.5" />
                    <p className="mt-1 text-right text-xs text-muted-foreground">{phaseProgress}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Calendar / Schedule / Steps */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="h-11 bg-card shadow-card">
            <TabsTrigger value="calendar" className="gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-1.5 text-sm">
              <Clock className="h-3.5 w-3.5" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="steps" className="gap-1.5 text-sm">
              <Target className="h-3.5 w-3.5" /> Action Steps
            </TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roadmap.map((day) => {
                const done = completedDays.has(day.day);
                const ContentIcon = CONTENT_TYPE_ICON[day.contentType || ""] || Circle;
                return (
                  <Card
                    key={day.day}
                    className={`cursor-pointer border transition-all hover:shadow-elevated ${
                      done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                    }`}
                    onClick={() => toggleDay(day.day)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold">
                            {day.day}
                          </span>
                          <div>
                            <p className="text-sm font-semibold leading-tight">{day.title}</p>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <ContentIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{day.contentType}</span>
                            </div>
                          </div>
                        </div>
                        {done ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-muted-foreground/30" />
                        )}
                      </div>
                      <ul className="mt-3 space-y-1">
                        {day.tasks.map((t, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Schedule View */}
          <TabsContent value="schedule">
            <Card className="border-0 bg-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Posting Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-4 border-b border-border pb-2 text-xs font-semibold text-muted-foreground">
                    <span>Day</span>
                    <span>Content</span>
                    <span>Type</span>
                    <span>Post Time</span>
                  </div>
                  {roadmap
                    .filter((d) => d.postTime && d.postTime !== "—")
                    .map((day) => {
                      const done = completedDays.has(day.day);
                      return (
                        <div
                          key={day.day}
                          className={`grid cursor-pointer grid-cols-4 gap-4 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-muted/50 ${
                            done ? "bg-primary/5" : ""
                          }`}
                          onClick={() => toggleDay(day.day)}
                        >
                          <span className="flex items-center gap-2">
                            {done ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground/30" />
                            )}
                            <span className="font-medium">Day {day.day}</span>
                          </span>
                          <span className="truncate">{day.title}</span>
                          <Badge variant="secondary" className="w-fit text-xs">
                            {day.contentType}
                          </Badge>
                          <span className="text-muted-foreground">{day.postTime}</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Optimal Posting Times */}
            <Card className="mt-6 border-0 bg-card shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Optimal Posting Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { type: "Long-form Videos", time: "2:00 PM", day: "Tue / Thu / Sat", icon: Video },
                    { type: "YouTube Shorts", time: "12:00 PM", day: "Mon / Wed / Fri", icon: Zap },
                    { type: "Community Posts", time: "6:00 PM", day: "Sun", icon: Megaphone },
                  ].map((slot) => (
                    <div key={slot.type} className="rounded-lg border border-border bg-background p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <slot.icon className="h-4 w-4" />
                        <span className="text-sm font-semibold">{slot.type}</span>
                      </div>
                      <p className="mt-2 font-display text-xl font-bold">{slot.time}</p>
                      <p className="text-xs text-muted-foreground">{slot.day}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Steps View */}
          <TabsContent value="steps">
            {PHASES.map((phase) => {
              const Icon = phase.icon;
              const days = getDaysForPhase(phase.id);
              return (
                <div key={phase.id} className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md ${phase.color}`}>
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{phase.label} Phase</h3>
                      <p className="text-xs text-muted-foreground">{phase.range}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {days.map((day) => {
                      const done = completedDays.has(day.day);
                      return (
                        <Card
                          key={day.day}
                          className={`cursor-pointer border transition-all hover:shadow-elevated ${
                            done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                          }`}
                          onClick={() => toggleDay(day.day)}
                        >
                          <CardContent className="flex items-start gap-4 p-4">
                            <div className="mt-0.5">
                              {done ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/30" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground">DAY {day.day}</span>
                                <Badge variant="secondary" className="text-xs">{day.contentType}</Badge>
                              </div>
                              <p className={`mt-1 font-semibold ${done ? "line-through text-muted-foreground" : ""}`}>
                                {day.title}
                              </p>
                              <ul className="mt-2 space-y-1">
                                {day.tasks.map((t, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {day.postTime && day.postTime !== "—" && (
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {day.postTime}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Roadmap;
