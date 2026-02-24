import DashboardLayout from "@/components/DashboardLayout";
import MetricCard from "@/components/MetricCard";
import { Users, Gift, TrendingUp, DollarSign } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentMembers = [
  { name: "Sarah Johnson", email: "sarah@email.com", points: 2450, status: "active", joined: "Feb 20, 2026" },
  { name: "Marcus Chen", email: "marcus@email.com", points: 1820, status: "active", joined: "Feb 18, 2026" },
  { name: "Aisha Williams", email: "aisha@email.com", points: 980, status: "pending", joined: "Feb 17, 2026" },
  { name: "David Park", email: "david@email.com", points: 3200, status: "active", joined: "Feb 15, 2026" },
  { name: "Elena Rodriguez", email: "elena@email.com", points: 560, status: "active", joined: "Feb 14, 2026" },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here's your member overview.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Members"
          value="12,847"
          change="+324 this month"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Active Rewards"
          value="8,291"
          change="+12% from last month"
          changeType="positive"
          icon={Gift}
        />
        <MetricCard
          title="Points Distributed"
          value="2.4M"
          change="+18% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Cash Back Earned"
          value="$184K"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      <div className="mt-8 rounded-xl border bg-card shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-heading text-xl font-semibold text-card-foreground">
            Recent Members
          </h2>
          <p className="text-sm text-muted-foreground">Latest member enrollments</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentMembers.map((member) => (
              <TableRow key={member.email}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>{member.points.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.status === "active" ? "default" : "secondary"}
                  >
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

export default Index;
