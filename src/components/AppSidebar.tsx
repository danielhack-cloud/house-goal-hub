import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Briefcase, Mail, Handshake, Settings, Receipt, DollarSign, Activity, UserCircle, LogIn, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Receipt, label: "Transactions", path: "/transactions" },
  { icon: DollarSign, label: "HomeDollars", path: "/rewards" },
  { icon: Activity, label: "Live Feed", path: "/feed" },
  { icon: Users, label: "Members", path: "/members" },
  { icon: UserCircle, label: "Profile", path: "/members/1" },
  { icon: Briefcase, label: "Job Board", path: "/jobs" },
  { icon: Mail, label: "Emails", path: "/emails" },
  { icon: Handshake, label: "Partners", path: "/partners" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-8 rounded" style={{ mixBlendMode: 'screen' }} />
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

      <div className="border-t border-sidebar-border p-4 space-y-3">
        {user ? (
          <div className="space-y-2">
            <p className="truncate text-xs font-medium text-sidebar-foreground/70">{user.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={async () => { await signOut(); navigate("/auth"); }}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={() => navigate("/auth")}
          >
            <LogIn className="h-4 w-4" /> Sign In
          </Button>
        )}
        <p className="text-xs text-sidebar-foreground/50">© 2026 HomeDollars.com</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
