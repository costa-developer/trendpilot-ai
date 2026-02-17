import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  feature: string;
  description?: string;
}

const UpgradePrompt = ({ feature, description }: UpgradePromptProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 bg-card p-8 text-center shadow-card sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/30">
        <Lock className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-5 font-display text-xl font-bold">{feature} is a Pro Feature</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description || `Upgrade to Pro to unlock ${feature.toLowerCase()} and get the most out of TrendPilot AI.`}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button className="w-full font-semibold sm:w-auto" onClick={() => navigate("/pricing")}>
          Upgrade to Pro — $29/mo
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/pricing")}>
          View Plans
        </Button>
      </div>
    </Card>
  );
};

export default UpgradePrompt;
