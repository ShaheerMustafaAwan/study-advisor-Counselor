import { useState } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sopReviews } from "@/data/sopReviews";

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border-0",
    "Under Review": "bg-blue-100 text-blue-700 border-0",
    Approved: "bg-emerald-100 text-emerald-700 border-0",
    "Revision Required": "bg-destructive/10 text-destructive border-0",
  };
  return map[status] ?? "";
};

const SOPReviewList = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("pending");

  const pending = sopReviews.filter(
    (s) => s.status === "Pending" || s.status === "Under Review"
  );
  const reviewed = sopReviews.filter(
    (s) => s.status === "Approved" || s.status === "Revision Required"
  );

  const stats = [
    { label: "Total SOPs", count: sopReviews.length, icon: FileText, color: "text-primary" },
    { label: "Pending Review", count: pending.filter((s) => s.status === "Pending").length, icon: Clock, color: "text-amber-600" },
    { label: "Under Review", count: pending.filter((s) => s.status === "Under Review").length, icon: AlertCircle, color: "text-blue-600" },
    { label: "Approved", count: reviewed.filter((s) => s.status === "Approved").length, icon: CheckCircle2, color: "text-emerald-600" },
  ];

  const renderTable = (items: typeof sopReviews, showFeedback: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>{showFeedback ? "Last Updated" : "Submitted"}</TableHead>
          <TableHead>Status</TableHead>
          {showFeedback && <TableHead>Feedback</TableHead>}
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((sop) => (
          <TableRow key={sop.id} className="hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {sop.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{sop.studentName}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{sop.program}</TableCell>
            <TableCell className="text-muted-foreground">
              {showFeedback ? sop.lastUpdated : sop.submissionDate}
            </TableCell>
            <TableCell>
              <Badge className={statusBadge(sop.status)}>{sop.status}</Badge>
            </TableCell>
            {showFeedback && (
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                {sop.feedback || "—"}
              </TableCell>
            )}
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => navigate(`/dashboard/sop-review/${sop.studentId}`)}
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
        <div>
          <h1 className="text-2xl font-bold text-foreground">SOP Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage student Statements of Purpose
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.count}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Card className="shadow-card">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">SOP Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Review ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="reviewed">
                  Reviewed ({reviewed.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="mt-4">
                {renderTable(pending, false)}
              </TabsContent>
              <TabsContent value="reviewed" className="mt-4">
                {renderTable(reviewed, true)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </CounselorLayout>
  );
};

export default SOPReviewList;
