import { useState } from "react";
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
import type { StudentDocument } from "@/types/studentProgress";

interface Props {
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

const DocumentsModule = ({ documents: initialDocs }: Props) => {
  const [documents, setDocuments] = useState(initialDocs);

  const updateStatus = (
    id: string,
    status: StudentDocument["verificationStatus"],
  ) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verificationStatus: status } : d)),
    );
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead>Document Name</TableHead>
            <TableHead>Upload Status</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead className="w-[200px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-secondary/30">
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
              <TableCell>
                <Select
                  value={doc.verificationStatus}
                  onValueChange={(v) =>
                    updateStatus(
                      doc.id,
                      v as StudentDocument["verificationStatus"],
                    )
                  }
                >
                  <SelectTrigger className="h-8 text-xs w-[170px]">
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
