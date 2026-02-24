import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

const MetricCard = ({ title, value, change, changeType, icon: Icon }: MetricCardProps) => {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-card-foreground">{value}</p>
      <p
        className={`mt-1 text-xs font-medium ${
          changeType === "positive"
            ? "text-success"
            : changeType === "negative"
            ? "text-destructive"
            : "text-muted-foreground"
        }`}
      >
        {change}
      </p>
    </div>
  );
};

export default MetricCard;
