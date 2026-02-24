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
  Users,
  TrendingUp,
  Star,
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
            <Home className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold text-primary">HomeDollars</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
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
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center lg:py-36">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground">
            <Sparkles className="h-4 w-4 text-secondary" />
            Launching Early 2026
          </div>
          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Turn Your Everyday Shopping Into a{" "}
            <span className="text-secondary">Down Payment</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Shop on Amazon like you normally do. Every dollar you spend earns HomeDollars
            that count toward buying your first home. It's that simple.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {user ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link to="/auth">
                    Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#waitlist">Join Waiting List</a>
                </Button>
              </>
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

      {/* Social Proof Stats */}
      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "12,400+", label: "Members Earning", icon: Users },
              { value: "$1.2M", label: "HomeDollars Earned", icon: TrendingUp },
              { value: "48,000+", label: "Receipts Uploaded", icon: Receipt },
              { value: "4.9 ★", label: "Member Rating", icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
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

      {/* Testimonials */}
      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
            What Members Are Saying
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Sarah M.",
                location: "Austin, TX",
                quote: "I've earned over 4,200 HomeDollars just from my normal Amazon shopping. I never thought saving for a home could be this easy!",
                hd: "HD 4,200",
              },
              {
                name: "Marcus J.",
                location: "Atlanta, GA",
                quote: "The receipt upload feature is genius. I was already spending this money — now it's working toward my down payment.",
                hd: "HD 6,850",
              },
              {
                name: "Emily & David R.",
                location: "Denver, CO",
                quote: "Between the two of us, we're earning double the HomeDollars. At this rate we'll hit our goal by next year.",
                hd: "HD 11,300",
              },
            ].map((t) => (
              <Card key={t.name} className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-heading text-sm font-semibold text-card-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {t.hd}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
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
