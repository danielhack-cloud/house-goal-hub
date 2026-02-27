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
    <div className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs md:text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-primary/10 p-1.5 md:p-2">
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
        </div>
      </div>
      <p className="mt-2 md:mt-3 font-heading text-xl md:text-3xl font-bold text-card-foreground">{value}</p>
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
