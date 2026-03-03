import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home, ShoppingCart, Receipt, PiggyBank, ArrowRight,
  Sparkles, Shield, TrendingUp, Users,
  Star, Handshake,
} from "lucide-react";

const Landing = () => {
  const { user } = useAuth();

  const steps = [
    { icon: ShoppingCart, title: "Shop Anywhere", description: "Shop at your favorite stores — online or in person. Every purchase counts." },
    { icon: Receipt, title: "Earn HomeDollars", description: "Every $1 you spend earns 1 HomeDollar. Upload receipts or shop through our link." },
    { icon: PiggyBank, title: "Save for Your Home", description: "Watch your HomeDollars grow toward a real down payment on your dream home." },
  ];

  const stats = [
    { value: "10K+", label: "Members on Waitlist" },
    { value: "$2.4M", label: "HomeDollars Earned" },
    { value: "50+", label: "Partner Brands" },
  ];

  const features = [
    { icon: Shield, title: "Bank-Grade Security", desc: "Your data is encrypted end-to-end. We never sell your information." },
    { icon: TrendingUp, title: "Smart Tracking", desc: "AI-powered receipt scanning auto-tracks your spending in seconds." },
    { icon: Users, title: "Community Driven", desc: "Join thousands of aspiring homeowners on the same journey." },
    { icon: Home, title: "Real Results", desc: "HomeDollars convert directly to real dollars toward your home purchase." },
  ];

  const testimonials = [
    { name: "Sarah M.", quote: "I've saved over 3,000 HD just from my regular grocery shopping. It's incredible!", stars: 5 },
    { name: "Marcus T.", quote: "The receipt scanning is so fast — snap a photo and you're done. Love it.", stars: 5 },
    { name: "Priya K.", quote: "Finally a rewards program that actually helps me buy a home, not just more stuff.", stars: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/20 bg-foreground/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-8 mix-blend-screen" />
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                <Link to="/track">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" className="text-background/70 hover:text-background hover:bg-background/10" asChild>
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

      {/* Hero — dark, split layout like reference */}
      <section className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-primary/20" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Launching Early 2026
              </div>
              <h1 className="font-heading text-4xl font-bold leading-tight text-background sm:text-5xl lg:text-6xl">
                Shop Your Way to a{" "}
                <span className="text-primary">Down Payment</span>
              </h1>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center gap-3 text-background/80 text-lg">
                  <Home className="h-5 w-5 text-primary shrink-0" />
                  Every $1 spent earns 1 HomeDollar
                </li>
                <li className="flex items-center gap-3 text-background/80 text-lg">
                  <ShoppingCart className="h-5 w-5 text-primary shrink-0" />
                  Shop at any store — online or in person
                </li>
                <li className="flex items-center gap-3 text-background/80 text-lg">
                  <PiggyBank className="h-5 w-5 text-primary shrink-0" />
                  HomeDollars go toward buying or maintaining your home
                </li>
                <li className="flex items-center gap-3 text-background/80 text-lg">
                  <Receipt className="h-5 w-5 text-primary shrink-0" />
                  AI-powered receipt scanning — snap and earn
                </li>
              </ul>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="text-base px-8 py-6 transition-transform hover:scale-105" asChild>
                  <Link to="/auth">
                    Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-background/50 text-background bg-background/10 text-base px-8 py-6 transition-transform hover:scale-105 hover:bg-background/15" asChild>
                  <Link to="/partners"><Handshake className="mr-2 h-4 w-4" /> Become a Partner</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-background/40">Join 10,000+ members saving toward homeownership</p>
            </div>

            {/* Right — image */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-background/10 shadow-2xl shadow-primary/10">
                <img src="/images/hero-home.webp" alt="Dream home" className="w-full h-auto object-cover aspect-[4/3]" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar — bridges hero to content */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="mx-auto max-w-4xl px-6 grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl sm:text-4xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps to start building toward homeownership.</p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card key={step.title} className="relative overflow-hidden border-border p-8 text-center hover:shadow-lg transition-shadow">
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Why HomeDollars?</h2>
            <p className="mt-3 text-muted-foreground">Built for aspiring homeowners, not advertisers.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Your Personal Dashboard</h2>
            <p className="mt-3 text-muted-foreground">Track every dollar, upload receipts, and watch your savings grow.</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-xl border border-border shadow-2xl">
            <img src="/images/dashboard-preview.webp" alt="HomeDollars dashboard" className="w-full" loading="lazy" />
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-border shadow-lg">
              <img src="/images/rewards-preview.webp" alt="Rewards page" className="w-full" loading="lazy" />
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold">Rewards & Tiers</h3>
                <p className="mt-2 text-sm text-muted-foreground">Level up from Starter to Homeowner as you earn. Unlock bonus multipliers.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border shadow-lg">
              <img src="/images/transactions-preview.webp" alt="Transaction tracking" className="w-full" loading="lazy" />
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold">Transaction Tracking</h3>
                <p className="mt-2 text-sm text-muted-foreground">Every purchase is logged when you submit a receipt. Transparent and easy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">What Members Say</h2>
            <p className="mt-3 text-muted-foreground">Real stories from future homeowners.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 italic">"{t.quote}"</p>
                <p className="mt-3 text-sm font-semibold">{t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-20 bg-primary/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Become a HomeDollars Partner</h2>
          <p className="mt-3 text-muted-foreground">Accept HomeDollars at your business. Attract new customers, drive repeat visits, and help people achieve homeownership.</p>
          <Button size="lg" className="mt-8" asChild>
            <Link to="/partners">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 HomeDollars.com — All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
