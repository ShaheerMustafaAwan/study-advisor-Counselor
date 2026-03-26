import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Download,
  Save,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { getSOPReview, SOPReview } from "@/data/sopReviews";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-0",
  "Under Review": "bg-blue-100 text-blue-700 border-0",
  Approved: "bg-emerald-100 text-emerald-700 border-0",
  "Revision Required": "bg-destructive/10 text-destructive border-0",
};

const SOPReviewDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const sop = getSOPReview(studentId || "");

  const [status, setStatus] = useState<SOPReview["status"]>(sop?.status ?? "Pending");
  const [feedback, setFeedback] = useState(sop?.feedback ?? "");

  if (!sop) {
    return (
      <CounselorLayout>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>SOP not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/sop-review")}>
            Back to SOP Reviews
          </Button>
        </div>
      </CounselorLayout>
    );
  }

  return (
    <CounselorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sop-review")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {sop.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-foreground">{sop.studentName}</h1>
              <p className="text-sm text-muted-foreground">{sop.program}</p>
            </div>
          </div>
          <Badge className={`ml-auto ${statusColors[status]}`}>{status}</Badge>
        </div>

        {/* Two-panel layout */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left — SOP Content */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">Statement of Purpose</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => toast.success("SOP downloaded")}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-secondary/50 p-5 text-sm leading-relaxed text-foreground whitespace-pre-line max-h-[500px] overflow-y-auto">
                {sop.sopContent}
              </div>
            </CardContent>
          </Card>

          {/* Right — Actions */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Counselor Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Status */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Update Status</p>
                <Select value={status} onValueChange={(v) => setStatus(v as SOPReview["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Revision Required">Revision Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Feedback</p>
                <Textarea
                  placeholder="Write your feedback on this SOP..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[160px] text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full gap-2"
                  variant="gradient"
                  onClick={() => {
                    toast.success("Feedback submitted");
                  }}
                >
                  <Send className="h-4 w-4" /> Submit Feedback
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  onClick={() => toast.info("Draft saved")}
                >
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CounselorLayout>
  );
};

export default SOPReviewDetail;
