import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Upload, ExternalLink, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const receiptSchema = z.object({
  orderDate: z.string().min(1, "Order date is required"),
  orderTotal: z.string().min(1, "Order total is required").refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    "Must be a positive number"
  ),
  orderId: z.string().max(50).optional(),
});

const statusIcon = (s: string) => {
  if (s === "verified" || s === "credited") return <CheckCircle className="h-3.5 w-3.5" />;
  if (s === "pending") return <Clock className="h-3.5 w-3.5" />;
  return <AlertCircle className="h-3.5 w-3.5" />;
};

const statusVariant = (s: string) => {
  if (s === "verified" || s === "credited") return "default" as const;
  return "secondary" as const;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Transactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [orderDate, setOrderDate] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderId, setOrderId] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("order_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const parsed = receiptSchema.parse({ orderDate, orderTotal, orderId });
      const total = Number(parsed.orderTotal);
      const hdEarned = Math.floor(total);

      let receiptUrl: string | null = null;

      if (receiptFile) {
        const ext = receiptFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(path, receiptFile, { contentType: receiptFile.type });
        if (uploadError) throw uploadError;
        receiptUrl = path;
      }

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        order_date: parsed.orderDate,
        order_total: total,
        hd_earned: hdEarned,
        order_id: parsed.orderId || null,
        source: "receipt",
        status: "pending",
        receipt_url: receiptUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setOrderDate("");
      setOrderTotal("");
      setOrderId("");
      setReceiptFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({ title: "Receipt submitted!", description: "Your receipt is pending verification. HomeDollars will be credited once verified." });
    },
    onError: (err: any) => {
      const message = err?.message || "Failed to submit receipt";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const filtered = statusFilter === "all"
    ? transactions
    : transactions.filter((t: any) => t.status === statusFilter);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Transactions</h1>
        <p className="mt-1 text-muted-foreground">
          Shop on Amazon and earn 1 HomeDollar for every $1 spent
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Method 1: Shop via Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Shop on Amazon
            </CardTitle>
            <CardDescription>
              Use our link to shop on Amazon. Your purchases are automatically tracked and HomeDollars are credited to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full" asChild>
              <a href="https://www.amazon.com/?tag=homedollars-20" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Shop Now on Amazon
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Opens Amazon.com — your purchases will be tracked automatically via our affiliate link.
            </p>
          </CardContent>
        </Card>

        {/* Method 2: Receipt Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Submit a Receipt
            </CardTitle>
            <CardDescription>
              Shopped directly on Amazon? Upload a screenshot of your order confirmation to earn HomeDollars.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                submitMutation.mutate();
              }}
            >
              <div>
                <Label htmlFor="order-date">Order Date</Label>
                <Input id="order-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="order-total">Order Total ($)</Label>
                <Input id="order-total" type="number" placeholder="0.00" step="0.01" min="0.01" value={orderTotal} onChange={(e) => setOrderTotal(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="order-id">Order ID (optional)</Label>
                <Input id="order-id" placeholder="e.g. 114-3941689-8772232" value={orderId} onChange={(e) => setOrderId(e.target.value)} maxLength={50} />
              </div>
              <div>
                <Label>Receipt Screenshot</Label>
                <div
                  className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {receiptFile ? receiptFile.name : "Click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground/70">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
                      return;
                    }
                    setReceiptFile(file || null);
                  }}
                />
              </div>
              <Button className="w-full" type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Receipt
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="mt-8 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-card-foreground">
              Transaction History
            </h2>
            <p className="text-sm text-muted-foreground">All your Amazon purchases and HomeDollars earned</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="credited">Credited</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No transactions yet. Shop on Amazon or submit a receipt to get started!
          </div>
        ) : (
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
              {filtered.map((tx: any) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-muted-foreground">{formatDate(tx.order_date)}</TableCell>
                  <TableCell className="font-mono text-xs">{tx.order_id || "—"}</TableCell>
                  <TableCell>${Number(tx.order_total).toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-primary">+{tx.hd_earned}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{tx.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(tx.status)} className="gap-1 capitalize">
                      {statusIcon(tx.status)}
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
