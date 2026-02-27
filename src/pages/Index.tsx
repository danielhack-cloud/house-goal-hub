import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { DollarSign, ShoppingCart, Home, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const recentTransactions = [
  { date: "Feb 22, 2026", orderId: "114-3941689-8772232", amount: 87.42, hd: 87, source: "Link", status: "Verified" },
  { date: "Feb 20, 2026", orderId: "114-7782310-5543118", amount: 134.99, hd: 135, source: "Receipt", status: "Verified" },
  { date: "Feb 18, 2026", orderId: "114-2209384-1123456", amount: 52.30, hd: 52, source: "Link", status: "Verified" },
  { date: "Feb 15, 2026", orderId: "114-9981234-7654321", amount: 219.00, hd: 219, source: "Receipt", status: "Pending" },
  { date: "Feb 12, 2026", orderId: "114-5567890-3344556", amount: 45.88, hd: 46, source: "Link", status: "Verified" },
];

const statusColor = (s: string) => s === "Verified" ? "default" as const : "secondary" as const;

const Index = () => {
  const totalHD = 2847;
  const savingsGoal = 50000;
  const goalPercent = (totalHD / savingsGoal) * 100;

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            Welcome back! Track your HomeDollars and progress toward your dream home.
          </p>
        </div>
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <a href="https://www.amazon.com/?tag=homedollars-20" target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Shop on Amazon
          </a>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard title="HomeDollars Balance" value={`HD ${totalHD.toLocaleString()}`} change="+539 this month" changeType="positive" icon={DollarSign} />
        <MetricCard title="Lifetime Spending" value="$2,847" change="+$539 this month" changeType="positive" icon={ShoppingCart} />
        <MetricCard title="Transactions" value="34" change="5 this month" changeType="positive" icon={TrendingUp} />
        <MetricCard title="Current Tier" value="Builder" change="2,153 HD to Foundation" changeType="neutral" icon={Home} />
      </div>

      <Card className="mt-6 md:mt-8 p-4 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg md:text-xl font-semibold">Home Savings Goal</h2>
            <p className="text-sm text-muted-foreground">
              HD {totalHD.toLocaleString()} of HD {savingsGoal.toLocaleString()} target
            </p>
          </div>
          <p className="font-heading text-xl md:text-2xl font-bold text-primary">{goalPercent.toFixed(1)}%</p>
        </div>
        <Progress className="mt-4" value={goalPercent} />
        <p className="mt-2 text-xs text-muted-foreground">
          Every $1 you spend on Amazon earns 1 HomeDollar toward your down payment.
        </p>
      </Card>

      {/* Recent Transactions - mobile card view, desktop table */}
      <div className="mt-6 md:mt-8 rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4 md:p-6">
          <h2 className="font-heading text-lg md:text-xl font-semibold text-card-foreground">Recent Transactions</h2>
          <p className="text-sm text-muted-foreground">Your latest Amazon purchases</p>
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden divide-y">
          {recentTransactions.map((tx) => (
            <div key={tx.orderId} className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">+{tx.hd} HD</span>
                <Badge variant={statusColor(tx.status)} className="text-xs">{tx.status}</Badge>
              </div>
              <p className="text-sm">${tx.amount.toFixed(2)}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{tx.date}</span>
                <Badge variant="outline" className="text-xs">{tx.source}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>HD Earned</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.orderId}>
                  <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  <TableCell className="font-mono text-xs">{tx.orderId}</TableCell>
                  <TableCell>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-primary">+{tx.hd}</TableCell>
                  <TableCell><Badge variant="outline">{tx.source}</Badge></TableCell>
                  <TableCell><Badge variant={statusColor(tx.status)}>{tx.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
