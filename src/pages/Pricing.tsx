import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    key: "free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    amount: 0,
    features: ["3 channel analyses/month", "Basic trend insights", "5 AI-generated ideas", "Community support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    key: "pro",
    price: "$29",
    period: "/month",
    description: "For serious creators",
    amount: 2900,
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
    key: "agency",
    price: "$99",
    period: "/month",
    description: "Multi-channel management",
    amount: 9900,
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

const Pricing = () => {
  const { user } = useAuth();
  const { currentPlan, refetch } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  // Handle callback from Paystack
  useEffect(() => {
    const reference = searchParams.get("reference");
    const verified = searchParams.get("verified");
    if (reference && verified && user) {
      verifyTransaction(reference);
    }
  }, [searchParams, user]);

  const verifyTransaction = async (reference: string) => {
    setLoading("verifying");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("paystack-verify", {
        body: { reference },
      });
      if (res.error) throw new Error(res.error.message);
      toast({ title: "Subscription activated!", description: `You're now on the ${res.data.plan} plan.` });
      refetch();
      // Clean URL
      window.history.replaceState({}, "", "/pricing");
    } catch (e: any) {
      toast({ title: "Verification failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.key === "free") return;
    if (plan.key === "agency") {
      toast({ title: "Contact Sales", description: "Please reach out to our team for Agency plans." });
      return;
    }
    if (!user) {
      navigate("/auth");
      return;
    }
    if (currentPlan === plan.key) return;

    setLoading(plan.key);
    try {
      const res = await supabase.functions.invoke("paystack-initialize", {
        body: { email: user.email, plan: plan.key, amount: plan.amount },
      });
      if (res.error) throw new Error(res.error.message);
      const { data } = res;
      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (e: any) {
      toast({ title: "Payment error", description: e.message, variant: "destructive" });
      setLoading(null);
    }
  };

  const getButtonLabel = (plan: typeof plans[0]) => {
    if (loading === "verifying") return "Verifying...";
    if (loading === plan.key) return "Redirecting...";
    if (currentPlan === plan.key) return "Current Plan";
    return plan.cta;
  };

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:mt-16 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border-0 p-6 shadow-card transition-all hover:shadow-elevated sm:p-8 ${
                plan.highlighted ? "gradient-warm md:scale-105 ring-2 ring-secondary/50" : "bg-card"
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
                disabled={currentPlan === plan.key || !!loading}
                onClick={() => handleSubscribe(plan)}
              >
                {loading === plan.key && <Loader2 className="h-4 w-4 animate-spin" />}
                {getButtonLabel(plan)}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
