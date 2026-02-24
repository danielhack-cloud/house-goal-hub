import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, Briefcase, GraduationCap, Calendar, Mail, Phone, Globe,
  Linkedin, Award, Star, TrendingUp, Edit, Share2, Gift, Home,
} from "lucide-react";

const MemberProfile = () => {
  const member = {
    name: "Sarah Johnson",
    headline: "Marketing Director | Aspiring Homeowner",
    location: "Austin, TX",
    email: "sarah.johnson@email.com",
    phone: "(512) 555-0147",
    website: "sarahjohnson.com",
    linkedin: "linkedin.com/in/sarahjohnson",
    joined: "January 2025",
    tier: "Gold",
    points: 2450,
    nextTier: 5000,
    cashBackEarned: "$1,240",
    savingsGoal: "$45,000",
    currentSavings: "$18,500",
    bio: "Passionate about smart spending and building wealth through everyday purchases. Working toward my dream of owning a home in the Austin area. I love sharing savings tips with my community and helping others reach their financial goals.",
    currentJob: {
      title: "Marketing Director",
      company: "TechFlow Inc.",
      duration: "2023 – Present",
      location: "Austin, TX",
    },
    previousJobs: [
      { title: "Senior Marketing Manager", company: "GrowthLab", duration: "2020 – 2023", location: "Dallas, TX" },
      { title: "Marketing Specialist", company: "Bright Media", duration: "2017 – 2020", location: "Houston, TX" },
    ],
    education: [
      { school: "University of Texas at Austin", degree: "MBA, Marketing", year: "2017" },
      { school: "Texas A&M University", degree: "B.S. Communications", year: "2015" },
    ],
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Budget Planning", "Real Estate Research"],
    interests: ["Home Buying", "Personal Finance", "Cooking", "Hiking", "Travel"],
    recentActivity: [
      { action: "Earned 150 pts from Whole Foods purchase", date: "Feb 22, 2026" },
      { action: "Redeemed $25 cashback to savings", date: "Feb 20, 2026" },
      { action: "Referred Marcus Chen – earned 500 pts", date: "Feb 18, 2026" },
      { action: "Completed financial wellness quiz", date: "Feb 15, 2026" },
    ],
    customFields: {
      "Preferred Shopping Categories": "Groceries, Gas, Home Improvement",
      "Home Buying Timeline": "12 – 18 months",
      "Preferred Home Type": "Single-family, 3BR/2BA",
      "Target Neighborhood": "South Austin / Buda",
      "Pre-Approval Status": "In Progress",
      "Mortgage Lender": "First National Bank",
      "Real Estate Agent": "Jane Cooper, ReMax",
      "Annual Household Income": "$95,000 – $120,000",
    },
  };

  const savingsPercent = (18500 / 45000) * 100;
  const tierPercent = (member.points / member.nextTier) * 100;

  return (
    <DashboardLayout>
      {/* Cover + Avatar */}
      <div className="relative mb-20 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/70 p-8 pb-16">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
              </Button>
              <Button variant="outline" size="sm" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
        {/* Avatar */}
        <div className="absolute -bottom-14 left-8 z-20 flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-accent text-accent-foreground shadow-lg">
          <span className="font-heading text-3xl font-bold">SJ</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Info */}
          <Card className="p-6">
            <h1 className="font-heading text-2xl font-bold">{member.name}</h1>
            <p className="mt-1 text-muted-foreground">{member.headline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{member.location}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Joined {member.joined}</span>
              <Badge variant="default">{member.tier} Member</Badge>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{member.bio}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{member.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{member.phone}</span>
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{member.website}</span>
              <span className="flex items-center gap-1"><Linkedin className="h-3.5 w-3.5" />{member.linkedin}</span>
            </div>
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
              <Briefcase className="h-5 w-5 text-primary" /> Experience
            </h2>
            <div className="space-y-5">
              <div>
                <p className="font-medium">{member.currentJob.title}</p>
                <p className="text-sm text-muted-foreground">{member.currentJob.company} · {member.currentJob.duration}</p>
                <p className="text-xs text-muted-foreground">{member.currentJob.location}</p>
              </div>
              {member.previousJobs.map((job, i) => (
                <div key={i}>
                  <Separator className="mb-5" />
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company} · {job.duration}</p>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" /> Education
            </h2>
            <div className="space-y-4">
              {member.education.map((edu, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-4" />}
                  <p className="font-medium">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">{edu.degree} · {edu.year}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Skills & Interests */}
          <Card className="p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
            <Separator className="my-5" />
            <h2 className="mb-3 font-heading text-lg font-semibold">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((i) => (
                <Badge key={i} variant="outline">{i}</Badge>
              ))}
            </div>
          </Card>

          {/* Custom Fields */}
          <Card className="p-6">
            <h2 className="mb-4 font-heading text-lg font-semibold">Custom Profile Fields</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(member.customFields).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground">{key}</p>
                  <p className="mt-0.5 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Points & Tier */}
          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
              <Gift className="h-5 w-5 text-accent" /> Rewards
            </h2>
            <div className="text-center">
              <p className="font-heading text-4xl font-bold text-primary">{member.points.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Reward Points</p>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{member.tier}</span>
                <span>Platinum</span>
              </div>
              <Progress value={tierPercent} />
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {(member.nextTier - member.points).toLocaleString()} pts to Platinum
              </p>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cash Back Earned</span>
              <span className="font-semibold">{member.cashBackEarned}</span>
            </div>
          </Card>

          {/* Savings Goal */}
          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
              <Home className="h-5 w-5 text-success" /> Savings Goal
            </h2>
            <div className="text-center">
              <p className="font-heading text-2xl font-bold">{member.currentSavings}</p>
              <p className="text-sm text-muted-foreground">of {member.savingsGoal} goal</p>
            </div>
            <Progress className="mt-3" value={savingsPercent} />
            <p className="mt-1 text-center text-xs text-muted-foreground">{Math.round(savingsPercent)}% complete</p>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
            </h2>
            <div className="space-y-3">
              {member.recentActivity.map((a, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-3">
                  <p className="text-sm">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
              <Award className="h-5 w-5 text-accent" /> Achievements
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              {["🏠 Dream Saver", "🛒 Super Shopper", "👥 Referral Pro", "📊 Quiz Master", "💰 1K Club", "🔥 Streak 30"].map((badge) => (
                <div key={badge} className="rounded-lg bg-muted p-2">
                  <p className="text-xs font-medium">{badge}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberProfile;
