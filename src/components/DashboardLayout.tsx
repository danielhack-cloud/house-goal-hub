import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/use-push-notifications";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  usePushNotifications(user?.id);

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
