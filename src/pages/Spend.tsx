import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home, Wrench, HardHat, Shield, TreePine, Sparkles,
  Key, FileText, Search, Landmark, PaintBucket, Zap,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

type Category = "buying" | "homeowner" | "both";

const redemptions = [
  { title: "Down Payment", cost: 1000, icon: Landmark, desc: "Put HD toward your down payment fund", category: "buying" as const },
  { title: "Home Inspection", cost: 200, icon: Search, desc: "Professional pre-purchase inspection", category: "buying" as const },
  { title: "Closing Costs", cost: 500, icon: FileText, desc: "Apply HD to closing fees & legal costs", category: "buying" as const },
  { title: "Realtor Fees", cost: 400, icon: Key, desc: "Offset buyer agent commissions", category: "buying" as const },
  { title: "Mortgage Payment", cost: 500, icon: Home, desc: "Apply HD toward your monthly mortgage", category: "homeowner" as const },
  { title: "Plumber Service", cost: 150, icon: Wrench, desc: "Licensed plumbing repair or install", category: "homeowner" as const },
  { title: "Roof Repair", cost: 300, icon: HardHat, desc: "Professional roofing inspection & fix", category: "homeowner" as const },
  { title: "Home Insurance", cost: 200, icon: Shield, desc: "Credit toward your home insurance", category: "homeowner" as const },
  { title: "Landscaping", cost: 100, icon: TreePine, desc: "Lawn care and garden services", category: "homeowner" as const },
  { title: "Home Cleaning", cost: 75, icon: Sparkles, desc: "Professional deep cleaning service", category: "homeowner" as const },
  { title: "Interior Paint", cost: 125, icon: PaintBucket, desc: "Professional interior painting", category: "homeowner" as const },
  { title: "Electrician", cost: 175, icon: Zap, desc: "Licensed electrical work & repairs", category: "homeowner" as const },
];

const toggleOptions: { value: Category; label: string }[] = [
  { value: "buying", label: "Buying" },
  { value: "homeowner", label: "Homeowner" },
  { value: "both", label: "Both" },
];

const Spend = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Category>("both");
  const [redeemItem, setRedeemItem] = useState<typeof redemptions[0] | null>(null);
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  // Get real balance
  const { data: totalHD = 0 } = useQuery({
    queryKey: ["hd-balance", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data } = await supabase
        .from("transactions")
        .select("hd_earned")
        .eq("user_id", user.id);
      return (data || []).reduce((s: number, t: any) => s + (t.hd_earned || 0), 0);
    },
    enabled: !!user,
  });

  const filtered = filter === "both" ? redemptions : redemptions.filter((r) => r.category === filter);

  const handleRedeem = () => {
    if (!redeemItem) return;
    // Simulated redemption (no real deduction yet)
    setRedeemed((prev) => new Set(prev).add(redeemItem.title));
    toast({
      title: "Redemption Requested! 🎉",
      description: `${redeemItem.cost} HD for ${redeemItem.title}. We'll process this within 24 hours.`,
    });
    setRedeemItem(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-bold">Spend</h1>
        <p className="text-sm text-muted-foreground">Redeem your HomeDollars</p>
      </div>

      {/* Balance */}
      <Card className="p-5 mb-3 text-center bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-4xl font-bold font-heading mt-1">HD {totalHD.toLocaleString()}</p>
        </div>
      </Card>

      {/* Toggle */}
      <div className="flex rounded-lg bg-muted p-1 mb-4">
        {toggleOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
              filter === opt.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Redemption grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          const canAfford = totalHD >= item.cost;
          const isRedeemed = redeemed.has(item.title);
          return (
            <Card key={item.title} className={`p-4 flex flex-col ${isRedeemed ? "opacity-60" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {isRedeemed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Icon className="h-5 w-5 text-primary" />
                )}
              </div>
              <h3 className="font-heading text-sm font-semibold leading-tight">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 flex-1">{item.desc}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-primary">{item.cost} HD</span>
                <Button
                  size="sm"
                  variant={canAfford && !isRedeemed ? "default" : "secondary"}
                  className="text-xs h-7 px-3"
                  disabled={!canAfford || isRedeemed}
                  onClick={() => setRedeemItem(item)}
                >
                  {isRedeemed ? "Pending" : "Redeem"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation dialog */}
      <Dialog open={!!redeemItem} onOpenChange={() => setRedeemItem(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              {redeemItem && (
                <>
                  Redeem <span className="font-bold text-primary">{redeemItem.cost} HD</span> for{" "}
                  <span className="font-semibold">{redeemItem.title}</span>?
                  <br />
                  <span className="text-xs mt-1 block">{redeemItem.desc}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRedeemItem(null)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleRedeem}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Spend;
