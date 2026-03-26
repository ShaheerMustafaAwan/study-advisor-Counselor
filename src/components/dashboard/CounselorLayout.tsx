import { useState } from "react";
import Navbar from "./Navbar";
import DashboardSidebar from "./DashboardSidebar";
import { cn } from "@/lib/utils";

interface CounselorLayoutProps {
  children: React.ReactNode;
}

const CounselorLayout = ({ children }: CounselorLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
      <DashboardSidebar collapsed={sidebarCollapsed} />
      <main
        className={cn(
          "pt-16 transition-all duration-300 min-h-screen",
          sidebarCollapsed ? "pl-[4.5rem]" : "pl-60"
        )}
      >
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
};

export default CounselorLayout;
