import { ReactNode, useState } from "react";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  usePushNotifications(user?.id);
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <>
          {/* Mobile top header */}
          <header
            className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-7 rounded" />
            <div className="w-9" /> {/* Spacer for centering logo */}
          </header>

          {/* Mobile drawer overlay */}
          {drawerOpen && (
            <div className="fixed inset-0 z-[100]" onClick={() => setDrawerOpen(false)}>
              <div className="absolute inset-0 bg-black/50" />
              <div
                className="absolute left-0 top-0 bottom-0 w-64 animate-in slide-in-from-left duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex h-14 items-center justify-between border-b bg-white px-4"
                  style={{ paddingTop: "env(safe-area-inset-top)" }}
                >
                  <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-7" />
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <AppSidebar onNavigate={() => setDrawerOpen(false)} />
              </div>
            </div>
          )}

          <main
            className="min-h-screen px-4"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 4.5rem)",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 5.5rem)",
            }}
          >
            {children}
          </main>

          <BottomNav />
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
