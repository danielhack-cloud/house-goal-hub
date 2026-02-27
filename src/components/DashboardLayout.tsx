import { ReactNode, useState } from "react";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  usePushNotifications(user?.id);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <>
          {/* Mobile top header */}
          <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-3 border-b bg-sidebar px-4"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-7 rounded" style={{ mixBlendMode: 'screen' }} />
          </header>

          {/* Mobile sidebar drawer */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border [&>button]:text-sidebar-foreground">
              <AppSidebar onNavigate={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          <main
            className="min-h-screen px-4 pb-6"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 4.5rem)",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
            }}
          >
            {children}
          </main>
        </>
      ) : (
        <>
          <AppSidebar />
          <main className="ml-64 min-h-screen p-8">{children}</main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
