import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  program: string;
  onProgramChange: (v: string) => void;
}

const StudentFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  program,
  onProgramChange,
}: StudentFiltersProps) => (
  <div className="flex flex-col md:flex-row gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search students by name, email, or program..."
        className="pl-9 rounded-xl"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <Select value={status} onValueChange={onStatusChange}>
      <SelectTrigger className="w-full md:w-44 rounded-xl">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Review Needed">Review Needed</SelectItem>
        <SelectItem value="Completed">Completed</SelectItem>
      </SelectContent>
    </Select>
    <Select value={program} onValueChange={onProgramChange}>
      <SelectTrigger className="w-full md:w-52 rounded-xl">
        <SelectValue placeholder="All Programs" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Programs</SelectItem>
        <SelectItem value="Computer Science">Computer Science</SelectItem>
        <SelectItem value="Data Science">Data Science</SelectItem>
        <SelectItem value="Business Administration">Business Administration</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default StudentFilters;
