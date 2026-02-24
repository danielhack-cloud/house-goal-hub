import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { Gift, Star, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const tiers = [
  { name: "Bronze", range: "0 – 999 pts", members: 3210, color: "bg-secondary" },
  { name: "Silver", range: "1,000 – 2,499 pts", members: 4580, color: "bg-muted-foreground" },
  { name: "Gold", range: "2,500 – 4,999 pts", members: 3420, color: "bg-accent" },
  { name: "Platinum", range: "5,000+ pts", members: 1637, color: "bg-primary" },
];

const Rewards = () => {
  const total = tiers.reduce((s, t) => s + t.members, 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Rewards Program</h1>
        <p className="mt-1 text-muted-foreground">Track and manage member rewards points</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Points Issued" value="2.4M" change="+18% this month" changeType="positive" icon={Gift} />
        <MetricCard title="Points Redeemed" value="1.1M" change="+9% this month" changeType="positive" icon={Star} />
        <MetricCard title="Avg Points/Member" value="187" change="+5 from last month" changeType="positive" icon={TrendingUp} />
        <MetricCard title="Active Campaigns" value="6" change="2 ending soon" changeType="neutral" icon={Award} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-heading text-xl font-semibold">Tier Distribution</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <Card key={tier.name} className="p-5">
              <p className="text-sm font-medium text-muted-foreground">{tier.name}</p>
              <p className="mt-1 font-heading text-2xl font-bold">{tier.members.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{tier.range}</p>
              <Progress className="mt-3" value={(tier.members / total) * 100} />
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rewards;
