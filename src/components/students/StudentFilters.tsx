import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StudentStatus } from "@/types/student";

interface FilterOption {
  label: string;
  value: string;
}

interface StudentFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  program: string;
  onProgramChange: (v: string) => void;
  statusOptions: Array<{ value: "all" | StudentStatus; label: string }>;
  programOptions: FilterOption[];
}

const StudentFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  program,
  onProgramChange,
  statusOptions,
  programOptions,
}: StudentFiltersProps) => (
  <div className="rounded-2xl border border-primary/10 bg-white/70 p-3 md:p-4 flex flex-col md:flex-row gap-3 backdrop-blur-sm">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search students by name, email, or program..."
        className="pl-9 rounded-xl bg-white/85"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-full md:w-44 rounded-xl bg-white/85">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Select value={program} onValueChange={onProgramChange}>
      <SelectTrigger className="w-full md:w-52 rounded-xl bg-white/85">
        <SelectValue placeholder="All Programs" />
      </SelectTrigger>
      <SelectContent>
        {programOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default StudentFilters;
