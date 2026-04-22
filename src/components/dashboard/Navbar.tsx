import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell, GraduationCap, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "@/api/http";
import {
  getCounselorNotifications,
  markNotificationRead,
  startCounselorNotificationStream,
} from "@/api/counselorNotifications";
import { useCounselorIdentity } from "@/hooks/useCounselorIdentity";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity } = useCounselorIdentity();

  const { data: notificationsData } = useQuery({
    queryKey: ["navbar-counselor-notifications"],
    queryFn: () =>
      getCounselorNotifications({
        page: 1,
        limit: 8,
        read: "all",
        type: "all",
      }),
    refetchInterval: 30_000,
  });

  useEffect(() => {
    const stop = startCounselorNotificationStream({
      onNotification: () => {
        queryClient.invalidateQueries({
          queryKey: ["navbar-counselor-notifications"],
        });
      },
    });

    return () => stop();
  }, [queryClient]);

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["navbar-counselor-notifications"],
      });
    },
  });

  const unreadCount = notificationsData?.unreadCount || 0;

  const recentNotifications = useMemo(
    () => (notificationsData?.notifications || []).slice(0, 5),
    [notificationsData?.notifications],
  );

  const getNotificationTitle = (title: string) =>
    String(title || "").replace(/^\[[^\]]+\]\s*/, "");

  const openNotification = (
    notification: (typeof recentNotifications)[number],
  ) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    if (notification.studentId) {
      navigate(`/dashboard/student-progress/${String(notification.studentId)}`);
      return;
    }

    navigate("/notifications");
  };

  const handleLogout = () => {
    clearAuthToken();
    queryClient.removeQueries({ queryKey: ["counselor-identity"] });
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shadow-card">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:inline">
            The Study Advisor
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-[10px] font-semibold text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary">{unreadCount} unread</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {recentNotifications.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              recentNotifications.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => openNotification(item)}
                  className="flex flex-col items-start gap-1 py-2"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-medium line-clamp-1">
                      {getNotificationTitle(item.title)}
                    </span>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {item.student?.fullName || "Student"} ·{" "}
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </DropdownMenuItem>
              ))
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/notifications")}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
            {identity.initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-tight">
              {identity.displayName}
            </p>
            <p className="text-xs text-muted-foreground leading-tight">
              Counselor
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
