import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Members</h1>
          <p className="mt-1 text-muted-foreground">
            Manage member enrollment and profiles
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.email} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  <Badge variant={tierColors[member.tier] as any}>
                    {member.tier}
                  </Badge>
                </TableCell>
                <TableCell>{member.points.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={member.status === "active" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                </TableCell>
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
