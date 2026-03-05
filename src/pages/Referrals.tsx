import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Send, Loader2, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email");

const Referrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const inviteMutation = useMutation({
    mutationFn: async (referredEmail: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("referrals").insert({
        referrer_id: user.id,
        referred_email: referredEmail,
      } as any);
      if (error) {
        if (error.code === "23505") throw new Error("You've already invited this email.");
        throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Invitation sent!", description: "We'll notify them to join HomeDollars." });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleInvite = () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({ title: "Invalid email", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    inviteMutation.mutate(result.data);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Refer Friends & Family</h1>
        <p className="mt-1 text-muted-foreground">
          Invite people to join HomeDollars. They can choose to transfer HomeDollars they earn to your account!
        </p>
      </div>

      {/* How it works */}
      <Card className="p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-3">How Referrals Work</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl">📧</p>
            <p className="mt-2 font-semibold text-sm">Send Invite</p>
            <p className="mt-1 text-xs text-muted-foreground">Enter their email to invite</p>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl">📱</p>
            <p className="mt-2 font-semibold text-sm">They Join</p>
            <p className="mt-1 text-xs text-muted-foreground">They download and sign up</p>
          </div>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-2xl">💰</p>
            <p className="mt-2 font-semibold text-sm">Earn Together</p>
            <p className="mt-1 text-xs text-muted-foreground">They can transfer HD to you</p>
          </div>
        </div>
      </Card>

      {/* Invite form */}
      <Card className="p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" /> Invite Someone
        </h2>
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="referral-email" className="sr-only">Email</Label>
            <Input
              id="referral-email"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              maxLength={255}
            />
          </div>
          <Button onClick={handleInvite} disabled={inviteMutation.isPending}>
            {inviteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      {/* Referral list */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Your Referrals
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : referrals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No referrals yet. Invite someone to get started!</p>
        ) : (
          <div className="space-y-2">
            {referrals.map((ref: any) => (
              <div key={ref.id} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm truncate max-w-[200px]">{ref.referred_email}</span>
                <Badge variant={ref.status === "accepted" ? "default" : "secondary"}>
                  {ref.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default Referrals;
