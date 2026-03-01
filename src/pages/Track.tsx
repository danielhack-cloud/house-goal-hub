import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { DollarSign, ShoppingCart, Home, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const recentTransactions = [
  { date: "Feb 22, 2026", amount: 87.42, hd: 87, source: "Link", status: "Verified" },
  { date: "Feb 20, 2026", amount: 134.99, hd: 135, source: "Receipt", status: "Verified" },
  { date: "Feb 18, 2026", amount: 52.30, hd: 52, source: "Link", status: "Verified" },
  { date: "Feb 15, 2026", amount: 219.00, hd: 219, source: "Receipt", status: "Pending" },
  { date: "Feb 12, 2026", amount: 45.88, hd: 46, source: "Link", status: "Verified" },
];

const spendingCategories = [
  { name: "Groceries", amount: 842, percent: 30, color: "bg-primary" },
  { name: "Home Improvement", amount: 650, percent: 23, color: "bg-chart-2" },
  { name: "Electronics", amount: 520, percent: 18, color: "bg-chart-3" },
  { name: "Clothing", amount: 435, percent: 15, color: "bg-chart-4" },
  { name: "Other", amount: 400, percent: 14, color: "bg-chart-5" },
];

const Track = () => {
  const totalHD = 2847;
  const savingsGoal = 50000;
  const goalPercent = (totalHD / savingsGoal) * 100;

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold">Track</h1>
        <p className="text-sm text-muted-foreground">Your HomeDollars at a glance</p>
      </div>

      {/* Balance hero */}
      <Card className="p-5 mb-5 text-center bg-primary text-primary-foreground">
        <p className="text-sm opacity-80">HomeDollars Balance</p>
        <p className="text-4xl font-bold font-heading mt-1">HD {totalHD.toLocaleString()}</p>
        <p className="text-xs mt-1 opacity-70">+539 this month</p>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <MetricCard title="Lifetime" value="$2,847" change="+$539" changeType="positive" icon={ShoppingCart} />
        <MetricCard title="Transactions" value="34" change="5 this mo" changeType="positive" icon={TrendingUp} />
      </div>

      {/* Savings goal */}
      <Card className="p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-heading text-sm font-semibold">Home Savings Goal</h2>
            <p className="text-xs text-muted-foreground">HD {totalHD.toLocaleString()} / {savingsGoal.toLocaleString()}</p>
          </div>
          <span className="text-lg font-bold text-primary font-heading">{goalPercent.toFixed(1)}%</span>
        </div>
        <Progress value={goalPercent} className="h-3" />
      </Card>

      {/* Spending breakdown */}
      <Card className="p-4 mb-5">
        <h2 className="font-heading text-sm font-semibold mb-3">Spending Breakdown</h2>
        <div className="space-y-3">
          {spendingCategories.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{cat.name}</span>
                <span className="text-muted-foreground">${cat.amount}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent transactions */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-heading text-sm font-semibold">Recent Transactions</h2>
        </div>
        <div className="divide-y">
          {recentTransactions.map((tx, i) => (
            <div key={i} className="p-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-primary">+{tx.hd} HD</span>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">${tx.amount.toFixed(2)}</p>
                <Badge variant={tx.status === "Verified" ? "default" : "secondary"} className="text-[10px]">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Track;
