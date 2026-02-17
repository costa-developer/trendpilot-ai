import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, Calendar, Shield, ArrowUpRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

const planDetails: Record<string, { name: string; price: string; features: string[] }> = {
  free: {
    name: "Free",
    price: "$0/forever",
    features: ["3 channel analyses/month", "Basic trend insights", "5 AI-generated ideas", "Community support"],
  },
  pro: {
    name: "Pro",
    price: "$29/month",
    features: [
      "Unlimited analyses",
      "Advanced trend detection",
      "Unlimited AI content generation",
      "Full script outlines",
      "Growth roadmap & 30-day plans",
      "Priority support",
    ],
  },
  agency: {
    name: "Agency",
    price: "$99/month",
    features: [
      "Everything in Pro",
      "Up to 10 channels",
      "Team collaboration",
      "White-label reports",
      "API access",
      "Dedicated account manager",
    ],
  },
};

const Subscription = () => {
  const { user } = useAuth();
  const { subscription, currentPlan, isActive, isLoading } = useSubscription();
  const navigate = useNavigate();
  const plan = planDetails[currentPlan] || planDetails.free;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your plan and billing.</p>

        {/* Current Plan */}
        <Card className="mt-8 border-0 bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/30">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{plan.name} Plan</h2>
                  <Badge variant={isActive || currentPlan === "free" ? "default" : "secondary"} className="text-xs">
                    {currentPlan === "free" ? "Free" : isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{plan.price}</p>
              </div>
            </div>
            {currentPlan === "free" && (
              <Button className="gap-2 font-semibold" onClick={() => navigate("/pricing")}>
                <ArrowUpRight className="h-4 w-4" /> Upgrade
              </Button>
            )}
          </div>

          {/* Billing Info */}
          {subscription && currentPlan !== "free" && (
            <div className="mt-6 grid gap-4 rounded-lg bg-background p-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Paystack Reference</p>
                  <p className="text-sm font-medium">{subscription.paystack_reference || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Current Period Ends</p>
                  <p className="text-sm font-medium">
                    {subscription.current_period_end
                      ? format(new Date(subscription.current_period_end), "MMM d, yyyy")
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Plan Features */}
        <Card className="mt-6 border-0 bg-card p-6 shadow-card sm:p-8">
          <h3 className="text-lg font-bold">What's included</h3>
          <ul className="mt-4 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-xs text-primary">✓</span>
                {f}
              </li>
            ))}
          </ul>
          {currentPlan !== "free" && (
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-xs text-muted-foreground">
                To cancel your subscription, please manage it through your Paystack customer portal or contact support.
              </p>
            </div>
          )}
        </Card>

        {/* Account Info */}
        <Card className="mt-6 border-0 bg-card p-6 shadow-card">
          <h3 className="text-lg font-bold">Account</h3>
          <div className="mt-3 rounded-lg bg-background p-4">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
