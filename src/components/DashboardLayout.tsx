import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  usePushNotifications(user?.id);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen">
      {isMobile ? (
        <>
          {/* Mobile top header */}
          <header
            className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-center border-b bg-card px-4"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <img src="/images/homedollars-logo.png" alt="HomeDollars" className="h-7 rounded" />
          </header>

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
