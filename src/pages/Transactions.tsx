import { useState } from "react";
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
import { ShoppingCart, Upload, ExternalLink, CheckCircle, Clock, AlertCircle } from "lucide-react";

const mockTransactions = [
  { date: "Feb 22, 2026", orderId: "114-3941689-8772232", amount: 87.42, hd: 87, source: "Link", status: "Verified" },
  { date: "Feb 20, 2026", orderId: "114-7782310-5543118", amount: 134.99, hd: 135, source: "Receipt", status: "Verified" },
  { date: "Feb 18, 2026", orderId: "114-2209384-1123456", amount: 52.30, hd: 52, source: "Link", status: "Verified" },
  { date: "Feb 15, 2026", orderId: "114-9981234-7654321", amount: 219.00, hd: 219, source: "Receipt", status: "Pending" },
  { date: "Feb 12, 2026", orderId: "114-5567890-3344556", amount: 45.88, hd: 46, source: "Link", status: "Verified" },
  { date: "Feb 10, 2026", orderId: "114-1234567-8901234", amount: 312.50, hd: 313, source: "Receipt", status: "Credited" },
  { date: "Feb 8, 2026", orderId: "114-9876543-2109876", amount: 67.20, hd: 67, source: "Link", status: "Verified" },
  { date: "Feb 5, 2026", orderId: "114-4455667-7889900", amount: 158.75, hd: 159, source: "Receipt", status: "Credited" },
];

const statusIcon = (s: string) => {
  if (s === "Verified" || s === "Credited") return <CheckCircle className="h-3.5 w-3.5" />;
  if (s === "Pending") return <Clock className="h-3.5 w-3.5" />;
  return <AlertCircle className="h-3.5 w-3.5" />;
};

const statusVariant = (s: string) => {
  if (s === "Verified" || s === "Credited") return "default" as const;
  return "secondary" as const;
};

const Transactions = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all"
    ? mockTransactions
    : mockTransactions.filter((t) => t.status.toLowerCase() === statusFilter);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Transactions</h1>
        <p className="mt-1 text-muted-foreground">
          Shop on Amazon and earn 1 HomeDollar for every $1 spent
        </p>
      </div>

      {/* Two earning methods */}
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
            <div className="space-y-3">
              <div>
                <Label htmlFor="order-date">Order Date</Label>
                <Input id="order-date" type="date" />
              </div>
              <div>
                <Label htmlFor="order-total">Order Total ($)</Label>
                <Input id="order-total" type="number" placeholder="0.00" step="0.01" />
              </div>
              <div>
                <Label htmlFor="order-id">Order ID (optional)</Label>
                <Input id="order-id" placeholder="e.g. 114-3941689-8772232" />
              </div>
              <div>
                <Label>Receipt Screenshot</Label>
                <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center">
                  <div>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground/70">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
              <Button className="w-full">Submit Receipt</Button>
            </div>
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
            {filtered.map((tx) => (
              <TableRow key={tx.orderId}>
                <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                <TableCell className="font-mono text-xs">{tx.orderId}</TableCell>
                <TableCell>${tx.amount.toFixed(2)}</TableCell>
                <TableCell className="font-semibold text-primary">+{tx.hd}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.source}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(tx.status)} className="gap-1">
                    {statusIcon(tx.status)}
                    {tx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
