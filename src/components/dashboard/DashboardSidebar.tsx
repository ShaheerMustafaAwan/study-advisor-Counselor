import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "My Students", path: "/my-students" },
  { icon: BarChart3, label: "Student Progress", path: "/student-progress" },
  { icon: FileText, label: "SOP Review", path: "/sop-review" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Search, label: "University Search", path: "/university-search" },
];

interface DashboardSidebarProps {
  collapsed: boolean;
}

const DashboardSidebar = ({ collapsed }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 border-r border-white/60 bg-white/90 backdrop-blur-sm transition-all duration-300 flex flex-col py-4",
        collapsed ? "w-[4.5rem]" : "w-60"
      )}
    >
      <div className="px-3 pb-4">
        <div
          className={cn(
            "rounded-2xl border border-white/70 bg-white/65 px-3 py-2.5 transition-all duration-300",
            collapsed && "px-2",
          )}
        >
          <p className={cn("text-xs font-medium text-muted-foreground", collapsed && "text-center")}>
            {collapsed ? "NAV" : "Counselor Navigation"}
          </p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                isActive
                  ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20 -translate-y-0.5"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground hover:-translate-y-0.5"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
