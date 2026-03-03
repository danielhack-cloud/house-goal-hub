import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart, TrendingUp, Target, Camera, ArrowRight,
  Wallet, CalendarDays, Award,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const tiers = [
  { name: "Starter", min: 0, max: 999, icon: "🌱", color: "bg-muted" },
  { name: "Builder", min: 1000, max: 4999, icon: "🔨", color: "bg-primary/10" },
  { name: "Foundation", min: 5000, max: 14999, icon: "🏗️", color: "bg-primary/20" },
  { name: "Homeowner", min: 15000, max: Infinity, icon: "🏠", color: "bg-primary/30" },
];

const Track = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("order_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const stats = useMemo(() => {
    const totalHD = transactions.reduce((s: number, t: any) => s + (t.hd_earned || 0), 0);
    const totalSpent = transactions.reduce((s: number, t: any) => s + (t.order_total || 0), 0);
    const now = new Date();
    const thisMonth = transactions.filter((t: any) => {
      const d = new Date(t.order_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthHD = thisMonth.reduce((s: number, t: any) => s + (t.hd_earned || 0), 0);
    const monthSpent = thisMonth.reduce((s: number, t: any) => s + (t.order_total || 0), 0);
    return { totalHD, totalSpent, monthHD, monthSpent, txCount: transactions.length, monthTxCount: thisMonth.length };
  }, [transactions]);

  const savingsGoal = 50000;
  const goalPercent = Math.min((stats.totalHD / savingsGoal) * 100, 100);
  const currentTier = tiers.find((t) => stats.totalHD >= t.min && stats.totalHD <= t.max) || tiers[0];
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const tierPercent = nextTier
    ? ((stats.totalHD - currentTier.min) / (currentTier.max - currentTier.min + 1)) * 100
    : 100;

  const recentFive = transactions.slice(0, 5);

  // Spending categories breakdown
  const categories = useMemo(() => {
    if (transactions.length === 0) return [];
    // Since we don't have category data, show monthly breakdown
    const months: Record<string, number> = {};
    transactions.forEach((t: any) => {
      const d = new Date(t.order_date);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      months[key] = (months[key] || 0) + (t.order_total || 0);
    });
    const entries = Object.entries(months).slice(0, 5);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([name, amount]) => ({
      name,
      amount: Math.round(amount),
      percent: Math.round((amount / max) * 100),
    }));
  }, [transactions]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-bold">Track</h1>
        <p className="text-sm text-muted-foreground">Your HomeDollars at a glance</p>
      </div>

      {/* Balance hero */}
      <Card className="p-5 mb-4 text-center bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative">
          <p className="text-sm opacity-80">HomeDollars Balance</p>
          <p className="text-4xl font-bold font-heading mt-1">
            HD {stats.totalHD.toLocaleString()}
          </p>
          {stats.monthHD > 0 && (
            <p className="text-xs mt-1 opacity-70">+{stats.monthHD.toLocaleString()} this month</p>
          )}
        </div>
      </Card>

      {/* Tier badge */}
      <Card className="p-3 mb-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${currentTier.color} flex items-center justify-center text-lg`}>
          {currentTier.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-bold">{currentTier.name}</span>
            {nextTier && (
              <span className="text-[10px] text-muted-foreground">
                → {(nextTier.min - stats.totalHD).toLocaleString()} HD to {nextTier.name}
              </span>
            )}
          </div>
          <Progress value={tierPercent} className="h-2 mt-1" />
        </div>
        <Award className="h-5 w-5 text-primary shrink-0" />
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card className="p-3 text-center">
          <ShoppingCart className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="font-heading text-lg font-bold">{stats.txCount}</p>
          <p className="text-[10px] text-muted-foreground">Transactions</p>
        </Card>
        <Card className="p-3 text-center">
          <Wallet className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="font-heading text-lg font-bold">${stats.totalSpent.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Lifetime</p>
        </Card>
        <Card className="p-3 text-center">
          <CalendarDays className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="font-heading text-lg font-bold">{stats.monthTxCount}</p>
          <p className="text-[10px] text-muted-foreground">This Month</p>
        </Card>
      </div>

      {/* Savings goal */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-sm font-semibold">Home Savings Goal</h2>
          </div>
          <span className="text-lg font-bold text-primary font-heading">{goalPercent.toFixed(1)}%</span>
        </div>
        <Progress value={goalPercent} className="h-3 mb-1" />
        <p className="text-[10px] text-muted-foreground">
          HD {stats.totalHD.toLocaleString()} / {savingsGoal.toLocaleString()} — {(savingsGoal - stats.totalHD).toLocaleString()} to go
        </p>
      </Card>

      {/* Monthly breakdown */}
      {categories.length > 0 && (
        <Card className="p-4 mb-4">
          <h2 className="font-heading text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Monthly Breakdown
          </h2>
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted-foreground">${cat.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick capture CTA */}
      <Button
        className="w-full mb-4 gap-2 h-12"
        onClick={() => navigate("/capture")}
      >
        <Camera className="h-5 w-5" />
        Snap a Receipt to Earn HD
      </Button>

      {/* Recent transactions */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold">Recent Transactions</h2>
          {transactions.length > 5 && (
            <button
              onClick={() => navigate("/transactions")}
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
        {recentFive.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No transactions yet. Capture a receipt to get started!
          </div>
        ) : (
          <div className="divide-y">
            {recentFive.map((tx: any) => (
              <div key={tx.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-primary">+{tx.hd_earned} HD</span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.order_date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">${tx.order_total.toFixed(2)}</p>
                  <Badge variant={tx.status === "verified" || tx.status === "credited" ? "default" : "secondary"} className="text-[10px]">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Track;
