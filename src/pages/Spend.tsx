import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home, Wrench, HardHat, Shield, TreePine, Sparkles,
  Key, FileText, Search, Landmark, PaintBucket, Zap,
} from "lucide-react";

type Category = "buying" | "homeowner" | "both";

const redemptions = [
  // Buying a home
  { title: "Down Payment", cost: 1000, icon: Landmark, desc: "Put HD toward your down payment fund", category: "buying" as const },
  { title: "Home Inspection", cost: 200, icon: Search, desc: "Professional pre-purchase inspection", category: "buying" as const },
  { title: "Closing Costs", cost: 500, icon: FileText, desc: "Apply HD to closing fees & legal costs", category: "buying" as const },
  { title: "Realtor Fees", cost: 400, icon: Key, desc: "Offset buyer agent commissions", category: "buying" as const },
  // Homeowner
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
  { value: "buying", label: "Buying a Home" },
  { value: "homeowner", label: "Homeowner" },
  { value: "both", label: "Both" },
];

const Spend = () => {
  const totalHD = 2847;
  const [filter, setFilter] = useState<Category>("both");

  const filtered = filter === "both" ? redemptions : redemptions.filter((r) => r.category === filter);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold">Spend</h1>
        <p className="text-sm text-muted-foreground">Redeem your HomeDollars</p>
      </div>

      {/* Balance */}
      <Card className="p-5 mb-4 text-center bg-primary text-primary-foreground">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-4xl font-bold font-heading mt-1">HD {totalHD.toLocaleString()}</p>
      </Card>

      {/* Toggle */}
      <div className="flex rounded-lg bg-muted p-1 mb-5">
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
          return (
            <Card key={item.title} className="p-4 flex flex-col">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading text-sm font-semibold leading-tight">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 flex-1">{item.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-primary">{item.cost} HD</span>
                <Button
                  size="sm"
                  variant={canAfford ? "default" : "secondary"}
                  className="text-xs h-7 px-3"
                  disabled={!canAfford}
                  onClick={() => {}}
                >
                  Redeem
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Spend;
