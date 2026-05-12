import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Download, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSopReviewComment,
  getSopReviewById,
  toSopStatusApi,
  toSopStatusLabel,
  updateSopReview,
  type SopStatusLabel,
} from "@/api/counselorSop";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-0",
  "Under Review": "bg-blue-100 text-blue-700 border-0",
  Approved: "bg-emerald-100 text-emerald-700 border-0",
  "Revision Required": "bg-destructive/10 text-destructive border-0",
};

type ReviewActionStatus = "Under Review" | "Approved" | "Revision Required";

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

const toReviewActionStatus = (status: SopStatusLabel): ReviewActionStatus => {
  if (status === "Approved") return "Approved";
  if (status === "Revision Required") return "Revision Required";
  return "Under Review";
};

const SOPReviewDetail = () => {
  const { sopId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ReviewActionStatus>("Under Review");
  const [feedback, setFeedback] = useState("");
  const [commentBody, setCommentBody] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["counselor-sop-review", sopId],
    queryFn: () => getSopReviewById(sopId as string),
    enabled: Boolean(sopId),
  });

  const review = data?.review;
  const displayStatus = review ? toSopStatusLabel(review.status) : "Pending";

  useEffect(() => {
    if (!review) return;
    setStatus(toReviewActionStatus(toSopStatusLabel(review.status)));
    setFeedback(review.reviewNotes || "");
  }, [review]);

  const submitReviewMutation = useMutation({
    mutationFn: () =>
      updateSopReview(sopId as string, {
        status: toSopStatusApi(status),
        reviewNotes: feedback,
      }),
    onSuccess: () => {
      toast.success("SOP review updated");
      queryClient.invalidateQueries({
        queryKey: ["counselor-sop-review", sopId],
      });
      queryClient.invalidateQueries({ queryKey: ["counselor-sop-reviews"] });
    },
    onError: (mutationError) => {
      toast.error(
        (mutationError as Error)?.message || "Failed to update SOP review",
      );
    },
  });

  const saveNotesMutation = useMutation({
    mutationFn: () =>
      updateSopReview(sopId as string, {
        reviewNotes: feedback,
      }),
    onSuccess: () => {
      toast.success("Review notes saved");
      queryClient.invalidateQueries({
        queryKey: ["counselor-sop-review", sopId],
      });
      queryClient.invalidateQueries({ queryKey: ["counselor-sop-reviews"] });
    },
    onError: (mutationError) => {
      toast.error(
        (mutationError as Error)?.message || "Failed to save review notes",
      );
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: () => addSopReviewComment(sopId as string, commentBody),
    onSuccess: () => {
      toast.success("Comment added");
      setCommentBody("");
      queryClient.invalidateQueries({
        queryKey: ["counselor-sop-review", sopId],
      });
    },
    onError: (mutationError) => {
      toast.error((mutationError as Error)?.message || "Failed to add comment");
    },
  });

  const sortedComments = useMemo(
    () =>
      [...(review?.comments || [])].sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      ),
    [review?.comments],
  );

  if (!sopId) {
    return (
      <CounselorLayout>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>Invalid SOP route.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/sop-review")}
          >
            Back to SOP Reviews
          </Button>
        </div>
      </CounselorLayout>
    );
  }

  if (isLoading) {
    return (
      <CounselorLayout>
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-foreground">
            Loading SOP Review...
          </h1>
          <p className="text-muted-foreground">
            Fetching latest review data from backend.
          </p>
        </div>
      </CounselorLayout>
    );
  }

  if (isError) {
    return (
      <CounselorLayout>
        <Alert variant="destructive">
          <AlertTitle>Could not load SOP review</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message ||
              "Please check counselor auth token and API availability."}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/sop-review")}
        >
          Back to SOP Reviews
        </Button>
      </CounselorLayout>
    );
  }

  if (!review) {
    return (
      <CounselorLayout>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>SOP not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/sop-review")}
          >
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
        <div className="flex items-center gap-4 rounded-2xl gradient-surface border border-white/70 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/sop-review")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                {toInitials(review.user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {review.user?.fullName || "Unknown Student"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {review.title || "Statement of Purpose"}
              </p>
            </div>
          </div>
          <Badge
            className={`ml-auto ${statusColors[displayStatus] || statusColors.Pending}`}
          >
            {displayStatus}
          </Badge>
        </div>

        {/* Two-panel layout */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left — SOP Content */}
          <Card className="lg:col-span-2 glass-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">Statement of Purpose</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  if (!review.document?.fileUrl) {
                    toast.error("No SOP file is linked for this submission");
                    return;
                  }

                  window.open(
                    review.document.fileUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                  toast.success("SOP opened in a new tab");
                }}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-white/80 border border-primary/10 p-5 text-sm leading-relaxed text-foreground whitespace-pre-line max-h-[500px] overflow-y-auto">
                {review.content ||
                  "No SOP text content available. Please use the Download button to read the uploaded file."}
              </div>
              <div className="mt-4 text-xs text-muted-foreground flex flex-wrap gap-4">
                <span>Version: {review.version}</span>
                <span>
                  Submitted:{" "}
                  {formatDate(review.submittedAt || review.createdAt)}
                </span>
                <span>Updated: {formatDate(review.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Right — Actions */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Counselor Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Status */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Update Status
                </p>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ReviewActionStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Revision Required">
                      Revision Required
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Feedback
                </p>
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
                  disabled={submitReviewMutation.isPending}
                  onClick={() => submitReviewMutation.mutate()}
                >
                  <Send className="h-4 w-4" /> Submit Feedback
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  disabled={saveNotesMutation.isPending}
                  onClick={() => saveNotesMutation.mutate()}
                >
                  <Save className="h-4 w-4" /> Save Draft
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Add Comment
                </p>
                <Textarea
                  placeholder="Add a specific comment for this SOP..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
                <Button
                  className="w-full"
                  variant="outline"
                  disabled={!commentBody.trim() || addCommentMutation.isPending}
                  onClick={() => addCommentMutation.mutate()}
                >
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Review Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedComments.length === 0 && (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
            {sortedComments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-primary/10 bg-white/75 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {comment.author?.fullName || "Counselor"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CounselorLayout>
  );
};

export default SOPReviewDetail;
