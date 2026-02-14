import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["3 channel analyses/month", "Basic trend insights", "5 AI-generated ideas", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious creators",
    features: [
      "Unlimited analyses",
      "Advanced trend detection",
      "Unlimited AI content generation",
      "Full script outlines",
      "Growth roadmap & 30-day plans",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/month",
    description: "Multi-channel management",
    features: [
      "Everything in Pro",
      "Up to 10 channels",
      "Team collaboration",
      "White-label reports",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Pricing = () => (
  <div className="min-h-screen px-6 py-16">
    <div className="container mx-auto max-w-5xl">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Start free and upgrade as you grow. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col border-0 p-8 shadow-card transition-all hover:shadow-elevated ${
              plan.highlighted ? "gradient-warm scale-105 ring-2 ring-secondary/50" : "bg-card"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-xs font-semibold text-primary">
                Most Popular
              </span>
            )}
            <div>
              <h3 className={`text-lg font-bold ${plan.highlighted ? "!text-primary-foreground" : ""}`}>{plan.name}</h3>
              <p className={`mt-1 text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
            </div>
            <div className="mt-6">
              <span className={`font-display text-4xl font-bold ${plan.highlighted ? "!text-primary-foreground" : ""}`}>
                {plan.price}
              </span>
              <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {plan.period}
              </span>
            </div>
            <ul className="mt-8 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}`}>
                  <Check className={`h-4 w-4 shrink-0 ${plan.highlighted ? "text-secondary" : "text-primary"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-8 w-full font-semibold"
              variant={plan.highlighted ? "secondary" : "default"}
              size="lg"
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default Pricing;
