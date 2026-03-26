import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "My Students" },
  { icon: BarChart3, label: "Student Progress" },
  { icon: FileText, label: "SOP Review" },
  { icon: Bell, label: "Notifications" },
  { icon: Search, label: "University Search" },
];

interface DashboardSidebarProps {
  collapsed: boolean;
}

const DashboardSidebar = ({ collapsed }: DashboardSidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 bg-card border-r border-border transition-all duration-300 flex flex-col py-4",
        collapsed ? "w-[4.5rem]" : "w-60"
      )}
    >
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              item.active
                ? "gradient-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
