import { useEffect, useMemo, useState } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  CheckCheck,
  Mail,
  MailOpen,
  AlertTriangle,
  FileText,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCounselorNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  startCounselorNotificationStream,
  type CounselorNotificationApi,
} from "@/api/counselorNotifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type UiNotificationType = "Documents" | "SOP" | "Profile" | "System Alert";
type UiPriority = "High" | "Medium" | "Low";

interface UiNotification {
  id: number;
  title: string;
  studentId: number | null;
  studentName: string;
  type: UiNotificationType;
  priority: UiPriority;
  timestamp: string;
  read: boolean;
  description: string;
  createdAt: string;
}

const priorityBadge: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-0",
  Medium: "bg-amber-100 text-amber-700 border-0",
  Low: "bg-muted text-muted-foreground border-0",
};

const typeBadge: Record<string, string> = {
  Documents: "bg-blue-100 text-blue-700 border-0",
  SOP: "bg-violet-100 text-violet-700 border-0",
  Profile: "bg-emerald-100 text-emerald-700 border-0",
  "System Alert": "bg-muted text-muted-foreground border-0",
};

const priorityOrder: Record<UiPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const toUiType = (
  value: CounselorNotificationApi["type"],
): UiNotificationType => {
  if (value === "DOCUMENT") return "Documents";
  if (value === "SOP") return "SOP";
  if (value === "PROFILE") return "Profile";
  return "System Alert";
};

const toPriority = (value: CounselorNotificationApi["type"]): UiPriority => {
  if (value === "SOP" || value === "DOCUMENT") return "High";
  if (value === "SYSTEM") return "Medium";
  return "Low";
};

const mapNotificationToUi = (
  notification: CounselorNotificationApi,
): UiNotification => ({
  id: notification.id,
  title: notification.title,
  studentId: notification.studentId ?? null,
  studentName: notification.student?.fullName || "Student",
  type: toUiType(notification.type),
  priority: toPriority(notification.type),
  timestamp: formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  }),
  read: notification.isRead,
  description: notification.message,
  createdAt: notification.createdAt,
});

const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "priority">("date");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["counselor-notifications"],
    queryFn: () =>
      getCounselorNotifications({
        page: 1,
        limit: 100,
        read: "all",
        type: "all",
      }),
  });

  useEffect(() => {
    const stopStream = startCounselorNotificationStream({
      onNotification: () => {
        queryClient.invalidateQueries({
          queryKey: ["counselor-notifications"],
        });
      },
      onError: (streamError) => {
        console.warn("NOTIFICATION_STREAM_ERROR", streamError.message);
      },
    });

    return () => {
      stopStream();
    };
  }, [queryClient]);

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationRead(id),
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ["counselor-notifications"] });
    },
    onError: (mutationError) => {
      toast.error(
        (mutationError as Error)?.message || "Failed to update notification",
      );
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["counselor-notifications"] });
    },
    onError: (mutationError) => {
      toast.error(
        (mutationError as Error)?.message || "Failed to update notifications",
      );
    },
  });

  const items = useMemo(
    () => (data?.notifications || []).map(mapNotificationToUi),
    [data?.notifications],
  );

  const filtered = useMemo(() => {
    let list =
      typeFilter === "All" ? items : items.filter((n) => n.type === typeFilter);
    if (sortBy === "priority") {
      list = [...list].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    } else {
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  }, [items, typeFilter, sortBy]);

  const unread = items.filter((n) => !n.read).length;
  const highPriority = items.filter((n) => n.priority === "High").length;
  const docAlerts = items.filter((n) => n.type === "Documents").length;

  const markAsRead = (notification: UiNotification) => {
    if (notification.read) return;
    markReadMutation.mutate(notification.id);
  };

  const stats = [
    {
      label: "Total Notifications",
      count: items.length,
      icon: Bell,
      color: "text-primary",
    },
    { label: "Unread", count: unread, icon: Mail, color: "text-amber-600" },
    {
      label: "High Priority",
      count: highPriority,
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      label: "Document Alerts",
      count: docAlerts,
      icon: FileText,
      color: "text-blue-600",
    },
  ];

  return (
    <CounselorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Track alerts and updates across all your students
          </p>
        </div>

        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Could not load notifications</AlertTitle>
            <AlertDescription>
              {(error as Error)?.message ||
                "Please check API connectivity and counselor token."}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="shadow-card hover:shadow-card-hover transition-shadow"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {s.count}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notifications List */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-lg">All Notifications</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Documents">Documents</SelectItem>
                    <SelectItem value="SOP">SOP</SelectItem>
                    <SelectItem value="Profile">Profile</SelectItem>
                    <SelectItem value="System Alert">System Alert</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9"
                  onClick={() =>
                    setSortBy(sortBy === "date" ? "priority" : "date")
                  }
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {sortBy === "date" ? "Date" : "Priority"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9"
                  disabled={unread === 0 || markAllReadMutation.isPending}
                  onClick={() => markAllReadMutation.mutate()}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark All Read
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading && (
              <p className="text-sm text-muted-foreground py-6">
                Loading notifications...
              </p>
            )}
            {!isLoading && filtered.length === 0 && (
              <p className="text-sm text-muted-foreground py-6">
                No notifications found.
              </p>
            )}
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  n.read
                    ? "bg-card border-border"
                    : "bg-primary/[0.03] border-primary/20"
                }`}
              >
                {/* Icon */}
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  {n.read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`text-sm font-medium ${n.read ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      {n.title}
                    </p>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${priorityBadge[n.priority]}`}
                    >
                      {n.priority}
                    </Badge>
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${typeBadge[n.type]}`}
                    >
                      {n.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {n.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {n.studentName}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {n.timestamp}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => markAsRead(n)}
                    disabled={n.read || markReadMutation.isPending}
                    title={n.read ? "Already read" : "Mark as read"}
                  >
                    {n.read ? (
                      <MailOpen className="h-3.5 w-3.5" />
                    ) : (
                      <Bell className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {n.studentId && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() =>
                        navigate(
                          `/dashboard/student-progress/${String(n.studentId)}`,
                        )
                      }
                      title="View student"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CounselorLayout>
  );
};

export default Notifications;
