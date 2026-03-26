import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, GraduationCap } from "lucide-react";
import type { University } from "@/data/studentProgress";

interface Props {
  universities: University[];
}

const statusColors: Record<string, string> = {
  Considering: "bg-secondary text-muted-foreground border-0",
  Shortlisted: "bg-primary/10 text-primary border-0",
  Applied: "bg-amber-100 text-amber-700 border-0",
  "Offer Received": "bg-emerald-100 text-emerald-700 border-0",
  Rejected: "bg-destructive/10 text-destructive border-0",
};

const UniversitiesModule = ({ universities: initial }: Props) => {
  const [universities, setUniversities] = useState(initial);

  const updateStatus = (id: string, status: University["status"]) => {
    setUniversities((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  return (
    <div className="grid gap-3">
      {universities.map((uni) => (
        <Card key={uni.id} className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-foreground truncate">{uni.name}</h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{uni.country}</span>
                <span className="flex items-center gap-1 truncate"><GraduationCap className="h-3.5 w-3.5" />{uni.program}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge className={statusColors[uni.status]}>{uni.status}</Badge>
              <Select value={uni.status} onValueChange={(v) => updateStatus(uni.id, v as University["status"])}>
                <SelectTrigger className="h-8 text-xs w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Considering">Considering</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Offer Received">Offer Received</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UniversitiesModule;
