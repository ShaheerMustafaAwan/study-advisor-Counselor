import { useMemo, useState } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Clock, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getSopReviews,
  SopReviewApi,
  toSopStatusLabel,
  type SopStatusLabel,
} from "@/api/counselorSop";
import { format } from "date-fns";

const statusBadge = (status: SopStatusLabel) => {
  const map: Record<SopStatusLabel, string> = {
    Pending: "bg-amber-100 text-amber-700 border-0",
    "Under Review": "bg-blue-100 text-blue-700 border-0",
    Approved: "bg-emerald-100 text-emerald-700 border-0",
    "Revision Required": "bg-destructive/10 text-destructive border-0",
    Draft: "bg-muted text-muted-foreground border-0",
  };
  return map[status] ?? "";
};

const toInitials = (name?: string) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return format(parsed, "MMM d, yyyy");
};

const SOPReviewList = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("pending");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["counselor-sop-reviews"],
    queryFn: () => getSopReviews({ status: "all", page: 1, limit: 100 }),
  });

  const reviews = data?.reviews ?? [];

  const pending = useMemo(
    () =>
      reviews.filter(
        (s) => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW",
      ),
    [reviews],
  );

  const reviewed = useMemo(
    () =>
      reviews.filter(
        (s) => s.status === "APPROVED" || s.status === "REVISION_REQUESTED",
      ),
    [reviews],
  );

  const stats = [
    {
      label: "Total SOPs",
      count: reviews.length,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Pending Review",
      count: pending.filter((s) => s.status === "SUBMITTED").length,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Under Review",
      count: pending.filter((s) => s.status === "UNDER_REVIEW").length,
      icon: AlertCircle,
      color: "text-blue-600",
    },
    {
      label: "Approved",
      count: reviewed.filter((s) => s.status === "APPROVED").length,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  const renderTable = (items: SopReviewApi[], showFeedback: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>SOP Title</TableHead>
          <TableHead>{showFeedback ? "Last Updated" : "Submitted"}</TableHead>
          <TableHead>Status</TableHead>
          {showFeedback && <TableHead>Feedback</TableHead>}
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={showFeedback ? 6 : 5}
              className="text-center text-muted-foreground py-8"
            >
              No SOPs found.
            </TableCell>
          </TableRow>
        )}
        {items.map((sop) => (
          <TableRow key={sop.id} className="hover:bg-primary/5">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
                    {toInitials(sop.user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {sop.user?.fullName || "Unknown Student"}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {sop.title || "Untitled SOP"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {showFeedback
                ? formatDate(sop.reviewedAt || sop.updatedAt)
                : formatDate(sop.submittedAt || sop.createdAt)}
            </TableCell>
            <TableCell>
              <Badge className={statusBadge(toSopStatusLabel(sop.status))}>
                {toSopStatusLabel(sop.status)}
              </Badge>
            </TableCell>
            {showFeedback && (
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                {sop.reviewNotes || "-"}
              </TableCell>
            )}
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => navigate(`/dashboard/sop-review/${sop.id}`)}
              >
                <Eye className="h-3.5 w-3.5" />
                {showFeedback ? "View" : "Review"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <CounselorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl gradient-surface border border-white/70 p-5 md:p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-foreground">SOP Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage student Statements of Purpose
          </p>
        </div>

        {isError && (
          <Alert variant="destructive">
            <AlertTitle>Could not load SOP reviews</AlertTitle>
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
              className="glass-card glass-card-hover"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {s.count}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Card className="glass-card">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">SOP Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="bg-primary/5">
                <TabsTrigger value="pending">
                  Pending Review ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="reviewed">
                  Reviewed ({reviewed.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground py-6">
                    Loading SOP reviews...
                  </p>
                ) : (
                  <div className="rounded-2xl border border-white/70 bg-white/65 overflow-auto">
                    {renderTable(pending, false)}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="reviewed" className="mt-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground py-6">
                    Loading SOP reviews...
                  </p>
                ) : (
                  <div className="rounded-2xl border border-white/70 bg-white/65 overflow-auto">
                    {renderTable(reviewed, true)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </CounselorLayout>
  );
};

export default SOPReviewList;
