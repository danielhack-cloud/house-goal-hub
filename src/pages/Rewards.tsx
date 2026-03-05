import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { DollarSign, TrendingUp, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Rewards = () => {
  const currentHD = 2847;
  const savingsGoal = 50000;
  const goalPercent = (currentHD / savingsGoal) * 100;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">HomeDollars</h1>
        <p className="mt-1 text-muted-foreground">
          Earn 1 HomeDollar for every $1 you spend — anywhere you shop. Save toward your dream home.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Your HomeDollars" value={`HD ${currentHD.toLocaleString()}`} change="+539 this month" changeType="positive" icon={DollarSign} />
        <MetricCard title="Lifetime Spending" value="$2,847" change="+$539 this month" changeType="positive" icon={TrendingUp} />
        <MetricCard title="Goal Progress" value={`${goalPercent.toFixed(1)}%`} change={`HD ${(savingsGoal - currentHD).toLocaleString()} remaining`} changeType="positive" icon={Home} />
      </div>

      {/* How it works */}
      <Card className="mt-8 p-6">
        <h2 className="font-heading text-xl font-semibold">How HomeDollars Work</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl">🛒</p>
            <p className="mt-2 font-semibold">Shop Anywhere</p>
            <p className="mt-1 text-sm text-muted-foreground">Any store, any purchase counts</p>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl">💰</p>
            <p className="mt-2 font-semibold">Earn HomeDollars</p>
            <p className="mt-1 text-sm text-muted-foreground">1 HD per $1 spent — automatically</p>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl">🏠</p>
            <p className="mt-2 font-semibold">Save for Your Home</p>
            <p className="mt-1 text-sm text-muted-foreground">Accumulate toward your down payment</p>
          </div>
        </div>
      </Card>

      {/* Home Savings Goal */}
      <Card className="mt-8 p-6">
        <h2 className="mb-2 font-heading text-xl font-semibold">Home Savings Goal</h2>
        <p className="text-sm text-muted-foreground">
          HD {currentHD.toLocaleString()} of HD {savingsGoal.toLocaleString()} down payment target
        </p>
        <Progress className="mt-4" value={goalPercent} />
        <p className="mt-2 text-xs text-muted-foreground">
          Keep shopping to reach your goal faster!
        </p>
      </Card>
    </DashboardLayout>
  );
};

export default Rewards;
