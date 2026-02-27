import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  MapPin, Briefcase, GraduationCap, Calendar, Mail, Phone, Globe,
  Linkedin, Award, TrendingUp, Edit, Share2, DollarSign, Home, ShoppingCart,
} from "lucide-react";

const MemberProfile = () => {
  const member = {
    name: "Jack Thompson",
    headline: "Product Manager | Aspiring Homeowner",
    location: "Austin, TX",
    email: "jack@test.com",
    avatar: "/images/headshot-jack.jpeg",
    phone: "(512) 555-0147",
    website: "sarahjohnson.com",
    linkedin: "linkedin.com/in/sarahjohnson",
    joined: "January 2025",
    tier: "Builder",
    homeDollars: 2847,
    lifetimeSpending: 2847,
    nextTierMin: 5000,
    nextTierName: "Foundation",
    savingsGoal: 45000,
    currentSavings: 2847,
    homeBuyingTimeline: "12 – 18 months",
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
      { action: "Earned 87 HD from a $87.42 purchase", date: "Feb 22, 2026" },
      { action: "Submitted receipt — 135 HD pending verification", date: "Feb 20, 2026" },
      { action: "Earned 52 HD from a $52.30 purchase", date: "Feb 18, 2026" },
      { action: "Referred Marcus Chen – earned 500 bonus HD", date: "Feb 15, 2026" },
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

  const savingsPercent = (member.currentSavings / member.savingsGoal) * 100;
  const tierPercent = ((member.homeDollars - 1000) / (member.nextTierMin - 1000)) * 100;

  return (
    <DashboardLayout>
      {/* Cover + Avatar */}
      <div className="relative mb-16 md:mb-20 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/70 p-6 md:p-8 pb-14 md:pb-16">
        <div className="relative z-10">
          <div className="flex items-start justify-end gap-2">
            <Button variant="outline" size="sm" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 text-xs md:text-sm">
              <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
            </Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 text-xs md:text-sm">
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        </div>
        <div className="absolute -bottom-12 md:-bottom-14 left-4 md:left-8 z-20 h-24 w-24 md:h-28 md:w-28 overflow-hidden rounded-full border-4 border-card shadow-lg">
          <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          <Card className="p-4 md:p-6">
            <h1 className="font-heading text-xl md:text-2xl font-bold">{member.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{member.headline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{member.location}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Joined {member.joined}</span>
              <Badge variant="default">{member.tier} Tier</Badge>
            </div>
            <p className="mt-3 md:mt-4 text-sm leading-relaxed text-foreground/80">{member.bio}</p>
            <div className="mt-3 md:mt-4 flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{member.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{member.phone}</span>
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{member.website}</span>
              <span className="flex items-center gap-1"><Linkedin className="h-3.5 w-3.5" />{member.linkedin}</span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 md:mb-4 flex items-center gap-2 font-heading text-base md:text-lg font-semibold">
              <Briefcase className="h-5 w-5 text-primary" /> Experience
            </h2>
            <div className="space-y-4 md:space-y-5">
              <div>
                <p className="font-medium text-sm md:text-base">{member.currentJob.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{member.currentJob.company} · {member.currentJob.duration}</p>
                <p className="text-xs text-muted-foreground">{member.currentJob.location}</p>
              </div>
              {member.previousJobs.map((job, i) => (
                <div key={i}>
                  <Separator className="mb-4 md:mb-5" />
                  <p className="font-medium text-sm md:text-base">{job.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{job.company} · {job.duration}</p>
                  <p className="text-xs text-muted-foreground">{job.location}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 md:mb-4 flex items-center gap-2 font-heading text-base md:text-lg font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" /> Education
            </h2>
            <div className="space-y-3 md:space-y-4">
              {member.education.map((edu, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-3 md:mb-4" />}
                  <p className="font-medium text-sm md:text-base">{edu.school}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{edu.degree} · {edu.year}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 font-heading text-base md:text-lg font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {member.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
            <Separator className="my-4 md:my-5" />
            <h2 className="mb-3 font-heading text-base md:text-lg font-semibold">Interests</h2>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {member.interests.map((i) => <Badge key={i} variant="outline" className="text-xs">{i}</Badge>)}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 md:mb-4 font-heading text-base md:text-lg font-semibold">Custom Profile Fields</h2>
            <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2">
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
        <div className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base md:text-lg font-semibold">
              <DollarSign className="h-5 w-5 text-accent" /> HomeDollars
            </h2>
            <div className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-bold text-primary">HD {member.homeDollars.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Lifetime Earned</p>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{member.tier}</span>
                <span>{member.nextTierName}</span>
              </div>
              <Progress value={tierPercent} />
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {(member.nextTierMin - member.homeDollars).toLocaleString()} HD to {member.nextTierName}
              </p>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <ShoppingCart className="h-3.5 w-3.5" /> Lifetime Spending
              </span>
              <span className="font-semibold">${member.lifetimeSpending.toLocaleString()}</span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base md:text-lg font-semibold">
              <Home className="h-5 w-5 text-primary" /> Home Savings Goal
            </h2>
            <div className="text-center">
              <p className="font-heading text-xl md:text-2xl font-bold">HD {member.currentSavings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">of HD {member.savingsGoal.toLocaleString()} goal</p>
            </div>
            <Progress className="mt-3" value={savingsPercent} />
            <p className="mt-1 text-center text-xs text-muted-foreground">{savingsPercent.toFixed(1)}% complete</p>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timeline</span>
              <span className="font-semibold">{member.homeBuyingTimeline}</span>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 md:mb-4 flex items-center gap-2 font-heading text-base md:text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Activity
            </h2>
            <div className="space-y-3">
              {member.recentActivity.map((a, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-3">
                  <p className="text-xs md:text-sm">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h2 className="mb-3 flex items-center gap-2 font-heading text-base md:text-lg font-semibold">
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
