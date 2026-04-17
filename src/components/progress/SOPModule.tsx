import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, RotateCcw, MessageSquare, Download } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSopReviewComment,
  toSopStatusApi,
  toSopStatusLabel,
  updateSopReview,
  type SopStatusLabel,
} from "@/api/counselorSop";
import { getCounselorStudentLatestSop } from "@/api/counselorStudents";

interface Props {
  studentId: string;
  sopContent: string;
}

const SOPModule = ({ studentId, sopContent }: Props) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: sop, isLoading } = useQuery({
    queryKey: ["counselor-student-sop", studentId],
    queryFn: () => getCounselorStudentLatestSop(studentId),
    enabled: Boolean(studentId),
    staleTime: 30_000,
  });

  useEffect(() => {
    setReviewNotes(sop?.reviewNotes || "");
  }, [sop?.id, sop?.reviewNotes]);

  const sopStatus = sop ? toSopStatusLabel(sop.status) : "Pending";

  const updateStatusMutation = useMutation({
    mutationFn: async (nextStatus: SopStatusLabel) => {
      if (!sop) {
        throw new Error("No SOP found for this student");
      }

      return updateSopReview(sop.id, {
        status: toSopStatusApi(nextStatus),
        reviewNotes,
      });
    },
    onSuccess: () => {
      toast.success("SOP review updated");
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-sop", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-activities", studentId],
      });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to update SOP review");
    },
  });

  const saveNotesMutation = useMutation({
    mutationFn: async () => {
      if (!sop) {
        throw new Error("No SOP found for this student");
      }

      return updateSopReview(sop.id, { reviewNotes });
    },
    onSuccess: () => {
      toast.success("Review notes saved");
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-sop", studentId],
      });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to save review notes");
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!sop) {
        throw new Error("No SOP found for this student");
      }

      if (!comment.trim()) {
        throw new Error("Comment cannot be empty");
      }

      return addSopReviewComment(sop.id, comment.trim());
    },
    onSuccess: () => {
      toast.success("Comment added");
      setComment("");
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-sop", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-activities", studentId],
      });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to add comment");
    },
  });

  const statusColors: Record<string, string> = {
    Pending: "bg-secondary text-muted-foreground border-0",
    Draft: "bg-secondary text-muted-foreground border-0",
    "Under Review": "bg-amber-100 text-amber-700 border-0",
    Approved: "bg-emerald-100 text-emerald-700 border-0",
    "Revision Required": "bg-destructive/10 text-destructive border-0",
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading SOP...</div>;
  }

  if (!sop) {
    return (
      <div className="text-sm text-muted-foreground">
        No SOP submission found for this student yet.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Statement of Purpose</CardTitle>
            <Badge className={statusColors[sopStatus] || statusColors.Pending}>
              {sopStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-secondary/50 p-5 text-sm leading-relaxed text-foreground whitespace-pre-line max-h-[400px] overflow-y-auto">
            {sop.content || sopContent || "No SOP text content available."}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Counselor Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            disabled={updateStatusMutation.isPending}
            onClick={() => updateStatusMutation.mutate("Approved")}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Approve SOP
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            disabled={updateStatusMutation.isPending}
            onClick={() => updateStatusMutation.mutate("Revision Required")}
          >
            <RotateCcw className="h-4 w-4 text-amber-600" /> Request Revisions
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={() => {
              if (!sop.document?.fileUrl) {
                toast.error("No SOP file is linked to this submission");
                return;
              }

              window.open(
                sop.document.fileUrl,
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            <Download className="h-4 w-4 text-primary" /> Download SOP
          </Button>

          <Textarea
            placeholder="Write overall review notes..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="text-sm min-h-[100px]"
          />
          <Button
            size="sm"
            className="w-full"
            variant="outline"
            disabled={saveNotesMutation.isPending}
            onClick={() => saveNotesMutation.mutate()}
          >
            Save Notes
          </Button>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Add Comment</p>
            <Textarea
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-sm min-h-[100px]"
            />
            <Button
              size="sm"
              className="mt-2 w-full gap-2"
              disabled={!comment.trim() || addCommentMutation.isPending}
              onClick={() => addCommentMutation.mutate()}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Submit Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOPModule;
