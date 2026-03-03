import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Handshake, Users, TrendingUp, DollarSign,
  ShieldCheck, Megaphone, BarChart3, Heart, CheckCircle2,
  Store, Repeat, Star,
} from "lucide-react";

const benefits = [
  { icon: Users, title: "Attract New Customers", desc: "HomeDollars members actively seek partner businesses. Get discovered by thousands of motivated shoppers looking to earn toward their home." },
  { icon: Megaphone, title: "Free Referral Marketing", desc: "Every purchase at your store gets shared in the HomeDollars community feed — free word-of-mouth advertising to an engaged audience." },
  { icon: DollarSign, title: "You Set the Terms", desc: "Choose how much HomeDollars you accept per transaction. Set your own maximum — you're always in control of your contribution." },
  { icon: TrendingUp, title: "Increase Foot Traffic", desc: "Members prefer HomeDollars-accepting businesses over competitors. Drive more visits, more sales, and higher average order values." },
  { icon: Repeat, title: "Build Repeat Business", desc: "Customers earning toward a home goal return again and again. HomeDollars creates a built-in loyalty loop at zero cost to you." },
  { icon: Heart, title: "Support Homeownership", desc: "Align your brand with a powerful social mission. Customers love businesses that help them achieve life goals." },
  { icon: Store, title: "Easy Integration", desc: "No hardware needed. Accept HomeDollars through our simple POS integration, QR codes, or manual entry — it takes minutes to set up." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track how many HomeDollars members visit your store, average spend, and redemption rates with your own partner dashboard." },
];

const howItWorks = [
  { step: "1", title: "Sign Up as a Partner", desc: "Fill out a quick application. We'll review and approve you within 48 hours." },
  { step: "2", title: "Set Your HD Acceptance", desc: "Choose how many HomeDollars you'll accept per transaction — 5%, 10%, or a custom cap you control." },
  { step: "3", title: "Start Earning Customers", desc: "Your business appears in the HomeDollars partner directory. Members find you, shop with you, and keep coming back." },
];

const Partners = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [bizName, setBizName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !bizName) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: email.trim().toLowerCase() });
    if (error && error.code !== "23505") {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Application received! 🎉", description: "We'll be in touch within 48 hours." });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-8 mix-blend-multiply" />
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Handshake className="mx-auto h-14 w-14 mb-6 opacity-90" />
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Become a HomeDollars Partner
          </h1>
          <p className="mt-4 text-lg opacity-85 max-w-2xl mx-auto">
            Accept HomeDollars at your business and tap into a growing community of engaged shoppers.
            Zero upfront cost. Full control over your terms.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> No fees to join</div>
            <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> You set the max</div>
            <div className="flex items-center gap-2"><Star className="h-4 w-4" /> 10K+ active members</div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Why Partner With HomeDollars?</h2>
            <p className="mt-3 text-muted-foreground">Everything you gain — nothing you lose.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <Card key={b.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Three steps to start growing your business with HomeDollars.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-20">
        <div className="mx-auto max-w-lg px-6 text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Apply Now</h2>
          <p className="mt-3 text-muted-foreground">Join our partner network — approval takes under 48 hours.</p>
          {submitted ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <p className="font-heading text-xl font-semibold">Application Received!</p>
              <p className="text-sm text-muted-foreground">We'll review your info and reach out within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-3 text-left">
              <Input placeholder="Business name" value={bizName} onChange={(e) => setBizName(e.target.value)} required />
              <Input type="email" placeholder="Business email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Partner Application"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 HomeDollars.com — All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Partners;
