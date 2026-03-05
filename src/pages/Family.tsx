import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const MAX_PRIMARY_FAMILY_PER_MONTH = 5;

const Family = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentMonth = format(new Date(), "yyyy-MM");

  const [memberName, setMemberName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderDate, setOrderDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["spending-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("spending_categories").select("*").order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch this month's family submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["family-submissions", user?.id, currentMonth],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("family_submissions")
        .select("*, spending_categories(name, is_primary)")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const primaryCount = submissions.filter((s: any) => s.is_primary).length;
  const selectedCategory = categories.find((c: any) => c.id === categoryId);
  const isPrimary = selectedCategory?.is_primary || false;

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const total = Number(orderTotal);
      if (!memberName.trim() || !categoryId || !total || total <= 0 || !orderDate) {
        throw new Error("Please fill all fields");
      }
      if (isPrimary && primaryCount >= MAX_PRIMARY_FAMILY_PER_MONTH) {
        throw new Error(`You can only submit ${MAX_PRIMARY_FAMILY_PER_MONTH} primary transactions for family members per month.`);
      }
      const { error } = await supabase.from("family_submissions").insert({
        user_id: user.id,
        family_member_name: memberName.trim(),
        category_id: categoryId,
        is_primary: isPrimary,
        order_total: total,
        order_date: orderDate,
        month: currentMonth,
        hd_earned: Math.floor(total),
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Submission added!", description: `+${Math.floor(Number(orderTotal))} HD earned` });
      setMemberName(""); setCategoryId(""); setOrderTotal("");
      queryClient.invalidateQueries({ queryKey: ["family-submissions"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Family & Friends</h1>
        <p className="mt-1 text-muted-foreground">
          Submit transactions for family members to earn HomeDollars. Up to {MAX_PRIMARY_FAMILY_PER_MONTH} primary category submissions per month, unlimited non-primary.
        </p>
      </div>

      {/* Monthly stats */}
      <div className="grid gap-4 grid-cols-2 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{primaryCount}/{MAX_PRIMARY_FAMILY_PER_MONTH}</p>
          <p className="text-xs text-muted-foreground">Primary submissions this month</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{submissions.filter((s: any) => !s.is_primary).length}</p>
          <p className="text-xs text-muted-foreground">Non-primary submissions this month</p>
        </Card>
      </div>

      {/* Add submission form */}
      <Card className="p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" /> Add Family Transaction
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="member-name">Family Member Name</Label>
            <Input
              id="member-name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Mom, Brother John"
              maxLength={100}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.is_primary && <span className="text-muted-foreground">(Primary)</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isPrimary && primaryCount >= MAX_PRIMARY_FAMILY_PER_MONTH && (
              <p className="text-xs text-destructive mt-1">Monthly primary limit reached</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order-total">Amount ($)</Label>
              <Input
                id="order-total"
                type="number"
                step="0.01"
                min="0.01"
                value={orderTotal}
                onChange={(e) => setOrderTotal(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="order-date">Date</Label>
              <Input
                id="order-date"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || (isPrimary && primaryCount >= MAX_PRIMARY_FAMILY_PER_MONTH)}
          >
            {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Transaction
          </Button>
        </div>
      </Card>

      {/* Submissions list */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> This Month's Submissions
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No family submissions this month yet.</p>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub: any) => (
              <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{sub.family_member_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.spending_categories?.name} · ${Number(sub.order_total).toFixed(2)} · {sub.order_date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">+{sub.hd_earned} HD</p>
                  <Badge variant={sub.is_primary ? "default" : "secondary"} className="text-[10px]">
                    {sub.is_primary ? "Primary" : "Non-Primary"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default Family;
