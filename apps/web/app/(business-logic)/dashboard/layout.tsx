import SidebarComponent from "@/components/dashboard/sidebar-comp";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider className="flex min-h-screen w-full overflow-x-hidden">
      <SidebarComponent initialDataPlayground={[]} />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
