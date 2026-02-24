import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Gift, Mail, FileText, Handshake, Settings, Home, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: Gift, label: "Rewards", path: "/rewards" },
  { icon: Briefcase, label: "Job Board", path: "/jobs" },
  { icon: Mail, label: "Emails", path: "/emails" },
  { icon: FileText, label: "Content", path: "/content" },
  { icon: Handshake, label: "Partners", path: "/partners" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Home className="h-6 w-6 text-sidebar-primary" />
        <span className="font-heading text-xl font-bold text-sidebar-primary">
          SavMoney
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">© 2026 SavMoney.com</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
