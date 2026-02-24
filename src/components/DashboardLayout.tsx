import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
