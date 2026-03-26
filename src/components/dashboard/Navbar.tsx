import { Bell, GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shadow-card">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:inline">The Study Advisor</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
        </Button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-tight">John Doe</p>
            <p className="text-xs text-muted-foreground leading-tight">Counselor</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
