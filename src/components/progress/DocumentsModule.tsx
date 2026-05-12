import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCounselorStudentDocumentReview } from "@/api/counselorStudents";
import type { StudentDocument } from "@/types/studentProgress";

interface Props {
  studentId: string;
  documents: StudentDocument[];
}

const statusColors: Record<string, string> = {
  Pending: "bg-secondary text-muted-foreground border-0",
  Approved: "bg-emerald-100 text-emerald-700 border-0",
  "Reupload Requested": "bg-amber-100 text-amber-700 border-0",
  Rejected: "bg-destructive/10 text-destructive border-0",
};

const uploadColors: Record<string, string> = {
  Uploaded: "bg-emerald-100 text-emerald-700 border-0",
  "Not Uploaded": "bg-secondary text-muted-foreground border-0",
};

const DocumentsModule = ({ studentId, documents: initialDocs }: Props) => {
  const [documents, setDocuments] = useState(initialDocs);
  const queryClient = useQueryClient();

  useEffect(() => {
    setDocuments(initialDocs);
  }, [initialDocs]);

  const reviewMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      status: StudentDocument["verificationStatus"];
    }) => {
      const documentId = Number(payload.id);
      if (Number.isNaN(documentId)) {
        throw new Error("Invalid document id");
      }

      await updateCounselorStudentDocumentReview(studentId, documentId, {
        verificationStatus: payload.status,
      });

      return payload;
    },
    onSuccess: ({ id, status }) => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                verificationStatus: status,
                reviewedAt: new Date().toISOString(),
              }
            : d,
        ),
      );
      toast.success("Document review updated");
      queryClient.invalidateQueries({
        queryKey: ["counselor-student", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-activities", studentId],
      });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to update review status");
    },
  });

  const updateStatus = (
    doc: StudentDocument,
    status: StudentDocument["verificationStatus"],
  ) => {
    if (doc.uploadStatus !== "Uploaded" || !doc.fileUrl) {
      toast.error("Cannot review a document that has not been uploaded");
      return;
    }

    reviewMutation.mutate({ id: doc.id, status });
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/65 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5">
            <TableHead>Document Name</TableHead>
            <TableHead>Upload Status</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Uploaded On</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="w-[200px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-primary/5">
              <TableCell className="font-medium text-foreground">
                {doc.name}
              </TableCell>
              <TableCell>
                <Badge className={uploadColors[doc.uploadStatus]}>
                  {doc.uploadStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[doc.verificationStatus]}>
                  {doc.verificationStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {doc.uploadedAt
                  ? new Date(doc.uploadedAt).toISOString().slice(0, 10)
                  : "-"}
              </TableCell>
              <TableCell>
                {doc.fileUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                  >
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Open
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={doc.verificationStatus}
                  onValueChange={(v) =>
                    updateStatus(
                      doc,
                      v as StudentDocument["verificationStatus"],
                    )
                  }
                >
                  <SelectTrigger
                    className="h-8 text-xs w-[170px]"
                    disabled={
                      doc.uploadStatus !== "Uploaded" ||
                      reviewMutation.isPending
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Reupload Requested">
                      Reupload Requested
                    </SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsModule;
