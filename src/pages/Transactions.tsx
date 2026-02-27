import { useState, useRef, useEffect } from "react";
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
import { ShoppingCart, Upload, ExternalLink, CheckCircle, Clock, AlertCircle, Loader2, Sparkles, PartyPopper, Camera } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/use-camera";
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
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [orderDate, setOrderDate] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderId, setOrderId] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ total: number; hd: number } | null>(null);
  const [autoSubmitPending, setAutoSubmitPending] = useState(false);
  const { takePhoto, checkNative, isNative } = useCamera();

  useEffect(() => { checkNative(); }, [checkNative]);

  const handleCameraCapture = async () => {
    if (isNative) {
      const result = await takePhoto();
      if (result) {
        setReceiptFile(result.file);
        parseReceipt(result.file);
      }
    } else {
      // Web fallback: trigger camera input
      cameraInputRef.current?.click();
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast({ title: "Invalid file type", description: "Only PNG and JPG allowed", variant: "destructive" });
      return;
    }
    setReceiptFile(file);
    parseReceipt(file);
  };

  const parseReceipt = async (file: File) => {
    setIsParsing(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("parse-receipt", {
        body: { imageBase64: base64, mimeType: file.type },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (data.orderDate) setOrderDate(data.orderDate);
      if (data.orderTotal) setOrderTotal(data.orderTotal);
      if (data.orderId) setOrderId(data.orderId);

      // If we have enough data, auto-submit
      if (data.orderDate && data.orderTotal && Number(data.orderTotal) > 0) {
        setAutoSubmitPending(true);
      } else {
        toast({ title: "Receipt parsed!", description: "Some fields need manual entry. Please review." });
      }
    } catch (err: any) {
      console.error("Parse error:", err);
      toast({ title: "Could not parse receipt", description: "Please fill in the fields manually.", variant: "destructive" });
    } finally {
      setIsParsing(false);
    }
  };

  // Auto-submit after parsing fills in the fields
  useEffect(() => {
    if (autoSubmitPending && orderDate && orderTotal && receiptFile && !submitMutation.isPending) {
      setAutoSubmitPending(false);
      submitMutation.mutate();
    }
  }, [autoSubmitPending, orderDate, orderTotal, receiptFile]);

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
      const total = Number(orderTotal);
      const hd = Math.floor(total);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setCelebrationData({ total, hd });
      setOrderDate("");
      setOrderTotal("");
      setOrderId("");
      setReceiptFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      <div className="mb-6 md:mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Transactions</h1>
        <p className="mt-1 text-sm md:text-base text-muted-foreground">
          Earn 1 HomeDollar for every $1 you spend — anywhere you shop
        </p>
      </div>

      {/* Prominent camera button */}
      <div className="mb-4">
        <Button size="lg" className="w-full gap-2 text-base py-6" onClick={handleCameraCapture} disabled={isParsing}>
          {isParsing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          {isParsing ? "Reading your receipt…" : "📸 Snap a Receipt"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-1.5">Take a photo and we'll auto-track everything</p>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* How it works */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Shop Anywhere
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Every $1 you spend earns 1 HomeDollar. Just submit your receipt.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-lg">🛒</p>
                <p className="mt-1 text-xs font-medium">Shop</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-lg">📸</p>
                <p className="mt-1 text-xs font-medium">Snap Receipt</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-lg">🏠</p>
                <p className="mt-1 text-xs font-medium">Earn HD</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Works with any store — groceries, electronics, clothing, and more.
            </p>
          </CardContent>
        </Card>

        {/* Receipt Upload */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Upload className="h-5 w-5 text-primary" />
              Submit a Receipt
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Upload a screenshot of your order confirmation to earn HomeDollars.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                submitMutation.mutate();
              }}
            >
              <div>
                <Label htmlFor="order-date">Order Date</Label>
                <Input id="order-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required className="h-11" />
              </div>
              <div>
                <Label htmlFor="order-total">Order Total ($)</Label>
                <Input id="order-total" type="number" placeholder="0.00" step="0.01" min="0.01" value={orderTotal} onChange={(e) => setOrderTotal(e.target.value)} required className="h-11" />
              </div>
              <div>
                <Label htmlFor="order-id">Order ID (optional)</Label>
                <Input id="order-id" placeholder="e.g. 114-3941689-8772232" value={orderId} onChange={(e) => setOrderId(e.target.value)} maxLength={50} className="h-11" />
              </div>
              <div>
                <Label>Receipt Screenshot</Label>
                <div
                  className={`mt-1 flex items-center justify-center rounded-lg border-2 border-dashed p-4 md:p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onClick={() => !isParsing && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (isParsing) return;
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                  }}
                >
                  <div>
                    {isParsing ? (
                      <>
                        <Sparkles className="mx-auto h-7 w-7 text-primary animate-pulse" />
                        <p className="mt-1.5 text-sm text-primary font-medium">Parsing receipt…</p>
                      </>
                    ) : isDragging ? (
                      <>
                        <Upload className="mx-auto h-7 w-7 text-primary" />
                        <p className="mt-1.5 text-sm text-primary font-medium">Drop here</p>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto h-7 w-7 text-muted-foreground/50" />
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {receiptFile ? receiptFile.name : "Tap to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground/70">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>




              <Button className="w-full h-11" type="submit" disabled={submitMutation.isPending || isParsing}>
                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Receipt
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="mt-6 md:mt-8 rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b p-4 md:p-6">
          <div>
            <h2 className="font-heading text-lg md:text-xl font-semibold text-card-foreground">Transaction History</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Your purchases and HomeDollars earned</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36">
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
          <div className="p-8 md:p-12 text-center text-muted-foreground">
            No transactions yet. Submit a receipt from any store to get started!
          </div>
        ) : (
          <>
            {/* Mobile card layout */}
            <div className="md:hidden divide-y">
              {filtered.map((tx: any) => (
                <div key={tx.id} className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">+{tx.hd_earned} HD</span>
                    <Badge variant={statusVariant(tx.status)} className="gap-1 capitalize text-xs">
                      {statusIcon(tx.status)}
                      {tx.status}
                    </Badge>
                  </div>
                  <p className="text-sm">${Number(tx.order_total).toFixed(2)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatDate(tx.order_date)}</span>
                    <Badge variant="outline" className="capitalize text-xs">{tx.source}</Badge>
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
                  {filtered.map((tx: any) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-muted-foreground">{formatDate(tx.order_date)}</TableCell>
                      <TableCell className="font-mono text-xs">{tx.order_id || "—"}</TableCell>
                      <TableCell>${Number(tx.order_total).toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-primary">+{tx.hd_earned}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{tx.source}</Badge></TableCell>
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
            </div>
          </>
        )}
      </div>

      {/* Celebration Dialog */}
      <Dialog open={!!celebrationData} onOpenChange={(open) => !open && setCelebrationData(null)}>
        <DialogContent className="text-center sm:max-w-sm">
          <DialogHeader className="items-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PartyPopper className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Receipt Submitted! 🎉</DialogTitle>
            <DialogDescription className="text-base">
              Your <span className="font-semibold text-foreground">${celebrationData?.total.toFixed(2)}</span> purchase earned you
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-5xl font-bold text-primary">{celebrationData?.hd}</p>
            <p className="mt-1 text-lg text-muted-foreground">HomeDollars</p>
          </div>
          <p className="text-sm text-muted-foreground">Pending verification — you'll be credited once confirmed.</p>
          <Button className="mt-2 w-full" onClick={() => setCelebrationData(null)}>Awesome!</Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transactions;
