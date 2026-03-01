import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Wrench, HardHat, Shield, TreePine, Sparkles } from "lucide-react";

const redemptions = [
  { title: "Mortgage Payment", cost: 500, icon: Home, desc: "Apply HD toward your monthly mortgage" },
  { title: "Plumber Service", cost: 150, icon: Wrench, desc: "Licensed plumbing repair or install" },
  { title: "Roof Repair", cost: 300, icon: HardHat, desc: "Professional roofing inspection & fix" },
  { title: "Home Insurance", cost: 200, icon: Shield, desc: "Credit toward your home insurance" },
  { title: "Landscaping", cost: 100, icon: TreePine, desc: "Lawn care and garden services" },
  { title: "Home Cleaning", cost: 75, icon: Sparkles, desc: "Professional deep cleaning service" },
];

const Spend = () => {
  const totalHD = 2847;

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-bold">Spend</h1>
        <p className="text-sm text-muted-foreground">Redeem your HomeDollars</p>
      </div>

      {/* Balance */}
      <Card className="p-5 mb-5 text-center bg-primary text-primary-foreground">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-4xl font-bold font-heading mt-1">HD {totalHD.toLocaleString()}</p>
      </Card>

      {/* Redemption grid */}
      <div className="grid grid-cols-2 gap-3">
        {redemptions.map((item) => {
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
