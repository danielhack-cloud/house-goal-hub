import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Building2, Clock, DollarSign, Bookmark } from "lucide-react";

const jobs = [
  {
    title: "Mortgage Loan Officer",
    company: "First National Bank",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$65K – $95K",
    posted: "2 days ago",
    tags: ["Finance", "Mortgage", "Customer Service"],
    description: "Help aspiring homeowners secure the right mortgage. Join our team dedicated to making homeownership accessible.",
    partner: true,
  },
  {
    title: "Real Estate Agent – Buyer's Specialist",
    company: "ReMax Elite",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$50K – $120K + commission",
    posted: "3 days ago",
    tags: ["Real Estate", "Sales", "Client Relations"],
    description: "Guide first-time homebuyers through the purchase process. Strong earning potential with our referral network.",
    partner: true,
  },
  {
    title: "Financial Advisor",
    company: "Wealth Path Advisory",
    location: "Remote",
    type: "Full-time",
    salary: "$70K – $110K",
    posted: "5 days ago",
    tags: ["Financial Planning", "Savings", "Investment"],
    description: "Help clients build wealth through personalized savings and investment strategies. CFP preferred.",
    partner: false,
  },
  {
    title: "Home Inspector",
    company: "TrustCheck Home Services",
    location: "Dallas, TX",
    type: "Full-time",
    salary: "$45K – $75K",
    posted: "1 week ago",
    tags: ["Inspection", "Construction", "Detail-Oriented"],
    description: "Conduct residential property inspections for homebuyers. Certification training provided.",
    partner: false,
  },
  {
    title: "Digital Marketing Manager",
    company: "HomeDollars.com",
    location: "Austin, TX · Hybrid",
    type: "Full-time",
    salary: "$80K – $105K",
    posted: "3 days ago",
    tags: ["Marketing", "SEO", "Analytics"],
    description: "Drive member growth and engagement through digital marketing campaigns. Data-driven approach required.",
    partner: true,
  },
  {
    title: "Customer Success Specialist",
    company: "HomeReady Insurance",
    location: "Remote",
    type: "Full-time",
    salary: "$42K – $58K",
    posted: "4 days ago",
    tags: ["Insurance", "Customer Service", "Onboarding"],
    description: "Support new homeowners with insurance onboarding and claims. Warm and empathetic communicators excel here.",
    partner: true,
  },
  {
    title: "Data Analyst – Consumer Savings",
    company: "FinTech Insights",
    location: "San Francisco, CA · Remote",
    type: "Contract",
    salary: "$55/hr",
    posted: "1 week ago",
    tags: ["Data Analysis", "Python", "FinTech"],
    description: "Analyze consumer spending patterns to identify savings opportunities. SQL and Python expertise required.",
    partner: false,
  },
  {
    title: "Property Manager",
    company: "Urban Living Properties",
    location: "Houston, TX",
    type: "Full-time",
    salary: "$50K – $68K",
    posted: "6 days ago",
    tags: ["Property Management", "Leasing", "Maintenance"],
    description: "Oversee residential property portfolio. Experience with tenant relations and property maintenance a plus.",
    partner: false,
  },
];

const Jobs = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Job Board</h1>
        <p className="mt-1 text-muted-foreground">
          Career opportunities from HomeDollars partners and the homeownership community
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs, companies, keywords..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="austin">Austin, TX</SelectItem>
            <SelectItem value="dallas">Dallas, TX</SelectItem>
            <SelectItem value="houston">Houston, TX</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job, i) => (
          <Card key={i} className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold">{job.title}</h3>
                  {job.partner && (
                    <Badge variant="default" className="text-xs">Partner</Badge>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.posted}</span>
                </div>
                <p className="mt-3 text-sm text-foreground/80">{job.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="ml-4 flex flex-col gap-2">
                <Button size="sm">Apply</Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
