import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  ShoppingCart,
  Receipt,
  PiggyBank,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Landing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: email.trim().toLowerCase() });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "You're already on the list!", description: "We'll be in touch soon." });
        setJoined(true);
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      }
    } else {
      setJoined(true);
      toast({ title: "You're on the list! 🎉", description: "We'll notify you when HomeDollars launches." });
    }
    setSubmitting(false);
  };

  const steps = [
    {
      icon: ShoppingCart,
      title: "Shop on Amazon",
      description: "Use your unique HomeDollars link to shop on Amazon like you normally do.",
    },
    {
      icon: Receipt,
      title: "Earn HomeDollars",
      description: "Every $1 you spend earns 1 HomeDollar. Upload receipts or shop through our link.",
    },
    {
      icon: PiggyBank,
      title: "Save for Your Home",
      description: "Watch your HomeDollars grow toward a real down payment on your dream home.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-8 mix-blend-multiply" />
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link to="/auth">{user ? "Account" : "Sign In"}</Link>
            </Button>
            {!user && (
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-home.webp')" }}
        />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center lg:py-36">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Launching Early 2026
          </div>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Turn Your Everyday Shopping Into a{" "}
            <span className="text-primary">Down Payment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Shop on Amazon like you normally do. Every dollar you spend earns HomeDollars
            that count toward buying your first home. It's that simple.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">
                Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#waitlist">Join Waiting List</a>
            </Button>
            {user && (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-card-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to start building toward homeownership.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card
                key={step.title}
                className="relative overflow-hidden border-border p-8 text-center"
              >
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-card-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-card-foreground sm:text-4xl">
              Your Personal HomeDollars Dashboard
            </h2>
            <p className="mt-3 text-muted-foreground">
              Track every dollar, upload receipts, and watch your savings grow — all in one place.
            </p>
          </div>

          {/* Main dashboard screenshot */}
          <div className="mt-12 overflow-hidden rounded-xl border border-border shadow-2xl">
            <img
              src="/images/dashboard-preview.webp"
              alt="HomeDollars dashboard showing balance, savings goal, and recent transactions"
              className="w-full"
              loading="lazy"
            />
          </div>

          {/* Secondary screenshots */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-border shadow-lg">
              <img
                src="/images/rewards-preview.webp"
                alt="Rewards and achievements page with tier badges and leaderboard"
                className="w-full"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold text-card-foreground">
                  Rewards & Tiers
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Level up from Starter to Homeowner as you earn. Unlock bonus multipliers and exclusive perks at every tier.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border shadow-lg">
              <img
                src="/images/transactions-preview.webp"
                alt="Transaction history with receipt uploads and HD earned"
                className="w-full"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold text-card-foreground">
                  Transaction Tracking
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every Amazon purchase is logged automatically. Upload receipts for additional earnings — it's all transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="border-t border-border py-24">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Join the Waiting List
          </h2>
          <p className="mt-3 text-muted-foreground">
            Be the first to know when HomeDollars launches. No spam, ever.
          </p>
          {joined ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-[hsl(var(--success))]" />
              <p className="font-heading text-xl font-semibold text-foreground">
                You're on the list!
              </p>
              <p className="text-sm text-muted-foreground">
                We'll send you an email when it's time to start earning.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleWaitlist}
              className="mx-auto mt-10 flex max-w-md gap-3"
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Joining..." : "Sign Up"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          © 2026 HomeDollars.com — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
