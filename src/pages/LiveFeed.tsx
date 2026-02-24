import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ShoppingCart, Upload, Users, Award, TrendingUp } from "lucide-react";

const feedItems = [
  { type: "purchase", user: "Sarah J.", action: "earned 87 HD from an Amazon purchase", amount: "$87.42", time: "2 min ago", icon: ShoppingCart },
  { type: "receipt", user: "Marcus C.", action: "submitted a receipt for verification", amount: "$135.00", time: "8 min ago", icon: Upload },
  { type: "referral", user: "Emily R.", action: "referred a new member and earned 500 bonus HD", amount: null, time: "15 min ago", icon: Users },
  { type: "tier", user: "David K.", action: "reached Builder tier!", amount: null, time: "32 min ago", icon: Award },
  { type: "purchase", user: "Jasmine L.", action: "earned 214 HD from an Amazon purchase", amount: "$214.18", time: "1 hr ago", icon: ShoppingCart },
  { type: "purchase", user: "Alex M.", action: "earned 52 HD from an Amazon purchase", amount: "$52.30", time: "1 hr ago", icon: ShoppingCart },
  { type: "receipt", user: "Taylor W.", action: "receipt verified — 98 HD credited", amount: "$98.00", time: "2 hrs ago", icon: Upload },
  { type: "tier", user: "Priya S.", action: "reached Foundation tier!", amount: null, time: "3 hrs ago", icon: Award },
  { type: "referral", user: "Jordan B.", action: "referred a new member and earned 500 bonus HD", amount: null, time: "4 hrs ago", icon: Users },
  { type: "purchase", user: "Nina F.", action: "earned 167 HD from an Amazon purchase", amount: "$167.55", time: "5 hrs ago", icon: ShoppingCart },
];

const typeColor: Record<string, string> = {
  purchase: "default",
  receipt: "secondary",
  referral: "outline",
  tier: "default",
};

const LiveFeed = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary" /> Live Feed
        </h1>
        <p className="mt-1 text-muted-foreground">Real-time community activity across HomeDollars</p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold font-heading">1,247</p>
            <p className="text-xs text-muted-foreground">HD earned today</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold font-heading">38</p>
            <p className="text-xs text-muted-foreground">Transactions today</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold font-heading">5</p>
            <p className="text-xs text-muted-foreground">New members today</p>
          </div>
        </Card>
      </div>

      {/* Feed */}
      <Card className="divide-y">
        {feedItems.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{item.user}</span>{" "}
                {item.action}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {item.amount && (
                <span className="text-sm font-medium">{item.amount}</span>
              )}
              <Badge variant={typeColor[item.type] as any} className="text-[10px]">
                {item.type}
              </Badge>
            </div>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
};

export default LiveFeed;
