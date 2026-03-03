import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Search, MapPin, Building2, Clock, DollarSign, Bookmark, ExternalLink, BookmarkCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const jobs = [
  { title: "Mortgage Loan Officer", company: "First National Bank", location: "Austin, TX", type: "Full-time", salary: "$65K – $95K", posted: "2 days ago", tags: ["Finance", "Mortgage", "Customer Service"], description: "Help aspiring homeowners secure the right mortgage. Join our team dedicated to making homeownership accessible.", partner: true },
  { title: "Real Estate Agent – Buyer's Specialist", company: "ReMax Elite", location: "Austin, TX", type: "Full-time", salary: "$50K – $120K + commission", posted: "3 days ago", tags: ["Real Estate", "Sales", "Client Relations"], description: "Guide first-time homebuyers through the purchase process. Strong earning potential with our referral network.", partner: true },
  { title: "Financial Advisor", company: "Wealth Path Advisory", location: "Remote", type: "Full-time", salary: "$70K – $110K", posted: "5 days ago", tags: ["Financial Planning", "Savings", "Investment"], description: "Help clients build wealth through personalized savings and investment strategies. CFP preferred.", partner: false },
  { title: "Home Inspector", company: "TrustCheck Home Services", location: "Dallas, TX", type: "Full-time", salary: "$45K – $75K", posted: "1 week ago", tags: ["Inspection", "Construction", "Detail-Oriented"], description: "Conduct residential property inspections for homebuyers. Certification training provided.", partner: false },
  { title: "Digital Marketing Manager", company: "HomeDollars.com", location: "Austin, TX", type: "Full-time", salary: "$80K – $105K", posted: "3 days ago", tags: ["Marketing", "SEO", "Analytics"], description: "Drive member growth and engagement through digital marketing campaigns. Data-driven approach required.", partner: true },
  { title: "Customer Success Specialist", company: "HomeReady Insurance", location: "Remote", type: "Full-time", salary: "$42K – $58K", posted: "4 days ago", tags: ["Insurance", "Customer Service", "Onboarding"], description: "Support new homeowners with insurance onboarding and claims. Warm and empathetic communicators excel here.", partner: true },
  { title: "Data Analyst – Consumer Savings", company: "FinTech Insights", location: "San Francisco, CA", type: "Contract", salary: "$55/hr", posted: "1 week ago", tags: ["Data Analysis", "Python", "FinTech"], description: "Analyze consumer spending patterns to identify savings opportunities. SQL and Python expertise required.", partner: false },
  { title: "Property Manager", company: "Urban Living Properties", location: "Houston, TX", type: "Full-time", salary: "$50K – $68K", posted: "6 days ago", tags: ["Property Management", "Leasing", "Maintenance"], description: "Oversee residential property portfolio. Experience with tenant relations and property maintenance a plus.", partner: false },
];

const locations = ["All Locations", "Austin, TX", "Dallas, TX", "Houston, TX", "Remote"];
const types = ["All Types", "Full-time", "Part-time", "Contract"];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);

  const filtered = useMemo(() => {
    return jobs.filter((job, _i) => {
      const matchesSearch = !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLocation = locationFilter === "All Locations" ||
        job.location.includes(locationFilter);
      const matchesType = typeFilter === "All Types" || job.type === typeFilter;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [searchQuery, locationFilter, typeFilter]);

  const toggleSave = (i: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
        toast({ title: "Removed from saved jobs" });
      } else {
        next.add(i);
        toast({ title: "Job saved! ⭐" });
      }
      return next;
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Job Board</h1>
        <p className="mt-1 text-sm md:text-base text-muted-foreground">
          {filtered.length} career opportunit{filtered.length === 1 ? "y" : "ies"} from HomeDollars partners
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, skills..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-40 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p className="text-sm">No jobs match your filters. Try broadening your search.</p>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filtered.map((job, i) => {
            const origIndex = jobs.indexOf(job);
            const isSaved = saved.has(origIndex);
            return (
              <Card key={i} className="p-4 md:p-5 transition-shadow hover:shadow-md cursor-pointer" onClick={() => setSelectedJob(job)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-base md:text-lg font-semibold">{job.title}</h3>
                      {job.partner && <Badge variant="default" className="text-xs">Partner</Badge>}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.posted}</span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{job.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col sm:ml-4" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="flex-1 sm:flex-none" onClick={() => setSelectedJob(job)}>
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="px-3" onClick={() => toggleSave(origIndex)}>
                      {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 text-primary" /> : <Bookmark className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Job detail dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {selectedJob && (
                <span className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{selectedJob.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedJob.location}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{selectedJob.type}</Badge>
                <Badge variant="outline">{selectedJob.salary}</Badge>
                <Badge variant="outline">{selectedJob.posted}</Badge>
                {selectedJob.partner && <Badge>HomeDollars Partner</Badge>}
              </div>
              <p className="text-sm leading-relaxed">{selectedJob.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <Button className="w-full gap-2">
                <ExternalLink className="h-4 w-4" /> Apply Now
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Jobs;
