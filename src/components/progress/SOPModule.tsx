import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, RotateCcw, MessageSquare, Download } from "lucide-react";
import { toast } from "sonner";

interface Props {
  sopContent: string;
}

const SOPModule = ({ sopContent }: Props) => {
  const [comment, setComment] = useState("");
  const [sopStatus, setSopStatus] = useState<"Under Review" | "Approved" | "Changes Requested">("Under Review");

  const statusColors: Record<string, string> = {
    "Under Review": "bg-amber-100 text-amber-700 border-0",
    Approved: "bg-emerald-100 text-emerald-700 border-0",
    "Changes Requested": "bg-destructive/10 text-destructive border-0",
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Statement of Purpose</CardTitle>
            <Badge className={statusColors[sopStatus]}>{sopStatus}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-secondary/50 p-5 text-sm leading-relaxed text-foreground whitespace-pre-line max-h-[400px] overflow-y-auto">
            {sopContent}
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
            onClick={() => { setSopStatus("Approved"); toast.success("SOP Approved"); }}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Approve SOP
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={() => { setSopStatus("Changes Requested"); toast.info("Changes requested"); }}
          >
            <RotateCcw className="h-4 w-4 text-amber-600" /> Request Changes
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={() => toast.success("SOP downloaded")}
          >
            <Download className="h-4 w-4 text-primary" /> Download SOP
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
              onClick={() => { if (comment.trim()) { toast.success("Comment added"); setComment(""); } }}
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
