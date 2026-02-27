import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Plus, Filter } from "lucide-react";

const members = [
  { name: "Sarah Johnson", email: "sarah@email.com", points: 2450, status: "active", joined: "Feb 20, 2026", tier: "Gold" },
  { name: "Marcus Chen", email: "marcus@email.com", points: 1820, status: "active", joined: "Feb 18, 2026", tier: "Silver" },
  { name: "Aisha Williams", email: "aisha@email.com", points: 980, status: "pending", joined: "Feb 17, 2026", tier: "Bronze" },
  { name: "David Park", email: "david@email.com", points: 3200, status: "active", joined: "Feb 15, 2026", tier: "Platinum" },
  { name: "Elena Rodriguez", email: "elena@email.com", points: 560, status: "active", joined: "Feb 14, 2026", tier: "Bronze" },
  { name: "James Wilson", email: "james@email.com", points: 4100, status: "active", joined: "Feb 12, 2026", tier: "Platinum" },
  { name: "Priya Patel", email: "priya@email.com", points: 1350, status: "inactive", joined: "Feb 10, 2026", tier: "Silver" },
  { name: "Carlos Mendez", email: "carlos@email.com", points: 2780, status: "active", joined: "Feb 8, 2026", tier: "Gold" },
];

const tierColors: Record<string, string> = {
  Bronze: "secondary",
  Silver: "secondary",
  Gold: "default",
  Platinum: "default",
};

const Members = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Members</h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            Manage member enrollment and profiles
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-10 h-11" />
        </div>
        <Button variant="outline" className="h-11">
          <Filter className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {members.map((member, i) => (
          <Card
            key={member.email}
            className="p-4 cursor-pointer active:bg-muted/50"
            onClick={() => navigate(`/members/${i + 1}`)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{member.name}</span>
              <Badge variant={tierColors[member.tier] as any} className="text-xs">{member.tier}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{member.email}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-semibold text-primary">{member.points.toLocaleString()} HD</span>
              <Badge variant={member.status === "active" ? "default" : "secondary"} className="text-xs">{member.status}</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>HomeDollars</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, i) => (
              <TableRow key={member.email} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/members/${i + 1}`)}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell><Badge variant={tierColors[member.tier] as any}>{member.tier}</Badge></TableCell>
                <TableCell>{member.points.toLocaleString()}</TableCell>
                <TableCell><Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{member.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Members;
