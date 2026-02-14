import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, Sparkles, Target, Zap, ArrowRight, Play, Check } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: BarChart3,
    title: "Channel Analysis",
    description: "Deep-dive into your channel metrics, engagement rates, and content performance patterns.",
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description: "Identify fast-growing topics in your niche with real-time trend scoring and opportunity analysis.",
  },
  {
    icon: Sparkles,
    title: "AI Content Generator",
    description: "Generate viral video ideas, optimized titles, SEO descriptions, and full script outlines.",
  },
  {
    icon: Target,
    title: "Growth Roadmap",
    description: "Get a personalized 30-day content plan with posting schedules and content clusters.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero px-6 py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="container relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm text-secondary">
            <Zap className="h-3.5 w-3.5" /> Powered by AI
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight !text-primary-foreground md:text-6xl lg:text-7xl">
            Grow Your YouTube
            <br />
            <span className="text-gradient">Channel Smarter</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70">
            TrendPilot AI analyzes your channel, detects trending topics, and generates viral content ideas — all powered
            by artificial intelligence.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2 px-8 text-base font-semibold">
                Start Free Analysis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-secondary/30 bg-transparent px-8 text-base font-semibold text-primary-foreground hover:bg-secondary/10 hover:text-primary-foreground"
              >
                <Play className="h-4 w-4" /> View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Everything You Need to Go Viral</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              From channel analytics to AI-powered content creation — TrendPilot gives you the unfair advantage.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <Card
                key={f.title}
                className="group border-0 bg-card p-8 shadow-card transition-all hover:shadow-elevated animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/50 transition-colors group-hover:bg-secondary">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="container mx-auto max-w-3xl">
          <Card className="overflow-hidden border-0 gradient-warm p-12 text-center shadow-elevated">
            <h2 className="font-display text-3xl font-bold !text-primary-foreground md:text-4xl">
              Ready to Grow Your Channel?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
              Join thousands of creators using TrendPilot AI to find trends, generate content, and grow faster.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2 px-8 text-base font-semibold">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> No credit card</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> 3 free analyses</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-primary">TrendPilot AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 TrendPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
