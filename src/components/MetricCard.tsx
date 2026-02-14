import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

const MetricCard = ({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: MetricCardProps) => {
  return (
    <Card
      className="group relative overflow-hidden border-0 bg-card p-6 shadow-card transition-all hover:shadow-elevated"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-3xl font-bold text-primary">{value}</p>
          {change && (
            <p
              className={`mt-1 text-sm font-medium ${
                changeType === "positive"
                  ? "text-green-600"
                  : changeType === "negative"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/50 text-primary transition-colors group-hover:bg-secondary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
