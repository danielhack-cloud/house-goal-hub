import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [ageRange, setAgeRange] = useState("");
  const [housingStatus, setHousingStatus] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        age_range: ageRange,
        housing_status: housingStatus,
        geographic_location: location,
        onboarding_completed: true,
      } as any)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  const steps = [
    // Step 0: Age range
    <div key="age" className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-center">What's your age range?</h2>
      <p className="text-sm text-muted-foreground text-center">This helps us match you with the best redemption partners.</p>
      <Select value={ageRange} onValueChange={setAgeRange}>
        <SelectTrigger>
          <SelectValue placeholder="Select age range" />
        </SelectTrigger>
        <SelectContent>
          {ageRanges.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="w-full" disabled={!ageRange} onClick={() => setStep(1)}>Continue</Button>
    </div>,

    // Step 1: Housing status
    <div key="housing" className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-center">Are you a renter or homeowner?</h2>
      <p className="text-sm text-muted-foreground text-center">We'll tailor your experience accordingly.</p>
      <RadioGroup value={housingStatus} onValueChange={setHousingStatus} className="space-y-3">
        <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50" onClick={() => setHousingStatus("renter")}>
          <RadioGroupItem value="renter" id="renter" />
          <Label htmlFor="renter" className="cursor-pointer flex-1">
            <span className="font-medium">Renter</span>
            <span className="block text-xs text-muted-foreground">I'm currently renting</span>
          </Label>
        </div>
        <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50" onClick={() => setHousingStatus("homeowner")}>
          <RadioGroupItem value="homeowner" id="homeowner" />
          <Label htmlFor="homeowner" className="cursor-pointer flex-1">
            <span className="font-medium">Homeowner</span>
            <span className="block text-xs text-muted-foreground">I own my home</span>
          </Label>
        </div>
      </RadioGroup>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
        <Button className="flex-1" disabled={!housingStatus} onClick={() => setStep(2)}>Continue</Button>
      </div>
    </div>,

    // Step 2: Location
    <div key="location" className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-center">Where are you located?</h2>
      <p className="text-sm text-muted-foreground text-center">City and state helps us find local partners.</p>
      <div>
        <Label htmlFor="location">City, State</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Austin, TX"
          maxLength={100}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
        <Button className="flex-1" disabled={!location.trim() || saving} onClick={handleFinish}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finish Setup"}
        </Button>
      </div>
    </div>,
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Home className="h-7 w-7 text-primary" />
          <span className="font-heading text-2xl font-bold text-primary">HomeDollars</span>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {steps[step]}
      </Card>
    </div>
  );
};

export default Onboarding;
