import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Loader2, PartyPopper, Receipt, TrendingUp, Zap } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/use-camera";

const tips = [
  { icon: Receipt, text: "Snap any receipt — groceries, gas, online orders" },
  { icon: Zap, text: "We auto-read totals so you don't have to type" },
  { icon: TrendingUp, text: "Every $1 spent = 1 HomeDollar earned" },
];

const Capture = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { takePhoto, checkNative, isNative } = useCamera();

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ total: number; hd: number } | null>(null);
  const [orderDate, setOrderDate] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderId, setOrderId] = useState("");
  const [autoSubmitPending, setAutoSubmitPending] = useState(false);

  // Quick stats
  const { data: recentCount = 0 } = useQuery({
    queryKey: ["tx-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      return count || 0;
    },
    enabled: !!user,
  });

  useEffect(() => { checkNative(); }, [checkNative]);

  const handleCameraCapture = async () => {
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (isNative) {
      const result = await takePhoto();
      if (result) {
        setReceiptFile(result.file);
        parseReceipt(result.file);
      }
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast({ title: "Invalid file type", description: "Only PNG and JPG", variant: "destructive" });
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
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
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
      if (data.orderDate && data.orderTotal && Number(data.orderTotal) > 0) {
        setAutoSubmitPending(true);
      } else {
        toast({ title: "Receipt parsed!", description: "Some fields need manual entry." });
      }
    } catch {
      toast({ title: "Could not parse receipt", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsParsing(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const total = Number(orderTotal);
      if (!orderDate || !total || total <= 0) throw new Error("Missing data");
      const hdEarned = Math.floor(total);
      let receiptUrl: string | null = null;
      if (receiptFile) {
        const ext = receiptFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("receipts").upload(path, receiptFile, { contentType: receiptFile.type });
        if (uploadError) throw uploadError;
        receiptUrl = path;
      }
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id, order_date: orderDate, order_total: total,
        hd_earned: hdEarned, order_id: orderId || null,
        source: "receipt", status: "pending", receipt_url: receiptUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      const total = Number(orderTotal);
      setCelebrationData({ total, hd: Math.floor(total) });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["tx-count"] });
      setOrderDate(""); setOrderTotal(""); setOrderId("");
      setReceiptFile(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message || "Failed to submit", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (autoSubmitPending && orderDate && orderTotal && receiptFile && !submitMutation.isPending) {
      setAutoSubmitPending(false);
      submitMutation.mutate();
    }
  }, [autoSubmitPending, orderDate, orderTotal, receiptFile]);

  const isProcessing = isParsing || submitMutation.isPending;

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="font-heading text-2xl font-bold mb-1">Capture Receipt</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Snap a photo and we'll auto-track your HomeDollars
        </p>

        {/* Camera button */}
        <button
          onClick={handleCameraCapture}
          disabled={isProcessing}
          className="w-28 h-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 mb-4 ring-4 ring-primary/20"
        >
          {isProcessing ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            <Camera className="h-10 w-10" />
          )}
        </button>

        <p className="text-xs text-muted-foreground mb-1">
          {isParsing ? "Reading your receipt…" : submitMutation.isPending ? "Submitting…" : "Tap to snap a receipt"}
        </p>

        {recentCount > 0 && (
          <p className="text-[10px] text-muted-foreground">
            {recentCount} receipt{recentCount !== 1 ? "s" : ""} submitted so far
          </p>
        )}

        {/* Receipt preview */}
        {receiptFile && !isProcessing && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
            <img
              src={URL.createObjectURL(receiptFile)}
              alt="Receipt preview"
              className="h-16 w-16 rounded-md object-cover border"
            />
            <div className="text-left">
              <p className="text-sm font-medium truncate max-w-[180px]">{receiptFile.name}</p>
              <p className="text-xs text-muted-foreground">Ready</p>
            </div>
          </div>
        )}

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

      {/* Tips section */}
      <div className="mt-2 space-y-2 px-2">
        {tips.map((tip, i) => {
          const Icon = tip.icon;
          return (
            <Card key={i} className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{tip.text}</p>
            </Card>
          );
        })}
      </div>

      {/* Celebration dialog */}
      <Dialog open={!!celebrationData} onOpenChange={() => setCelebrationData(null)}>
        <DialogContent className="text-center max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-2">
              <PartyPopper className="h-10 w-10 text-primary" />
              Receipt Submitted!
            </DialogTitle>
            <DialogDescription>
              {celebrationData && (
                <>
                  <span className="block text-2xl font-bold text-primary mt-2">
                    +{celebrationData.hd} HD
                  </span>
                  <span className="block text-sm mt-1">
                    ${celebrationData.total.toFixed(2)} purchase tracked
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full mt-2" onClick={() => setCelebrationData(null)}>
            Capture Another
          </Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Capture;
