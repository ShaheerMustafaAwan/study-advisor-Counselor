import { useState, useMemo } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Building2,
  Globe,
  Trophy,
  Search,
  ExternalLink,
  Send,
  GraduationCap,
  DollarSign,
  Star,
  MapPin,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { universities, countries, allPrograms, type University } from "@/data/universities";
import { students } from "@/data/students";
import { toast } from "sonner";

const UniversitySearch = () => {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [rankingFilter, setRankingFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortBy, setSortBy] = useState("ranking");
  const [recommendModal, setRecommendModal] = useState<University | null>(null);

  const filtered = useMemo(() => {
    let result = universities.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = countryFilter === "all" || u.country === countryFilter;
      const matchesProgram =
        programFilter === "all" || u.programs.includes(programFilter);
      const matchesRanking =
        rankingFilter === "all" ||
        (rankingFilter === "top10" && u.ranking <= 10) ||
        (rankingFilter === "top50" && u.ranking <= 50) ||
        (rankingFilter === "top100" && u.ranking <= 100);
      const matchesBudget =
        budgetFilter === "all" ||
        (budgetFilter === "low" && u.budget <= 10000) ||
        (budgetFilter === "medium" && u.budget > 10000 && u.budget <= 35000) ||
        (budgetFilter === "high" && u.budget > 35000);
      return matchesSearch && matchesCountry && matchesProgram && matchesRanking && matchesBudget;
    });

    result.sort((a, b) => {
      if (sortBy === "ranking") return a.ranking - b.ranking;
      if (sortBy === "budget") return a.budget - b.budget;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [search, countryFilter, programFilter, rankingFilter, budgetFilter, sortBy]);

  const partneredCount = universities.filter((u) => u.partnered).length;
  const countriesCount = countries.length;
  const top100Count = universities.filter((u) => u.ranking <= 100).length;

  const handleRecommend = (studentName: string) => {
    toast.success(`${recommendModal?.name} recommended to ${studentName}`);
    setRecommendModal(null);
  };

  const stats = [
    { label: "Partnered Universities", value: partneredCount, icon: Building2, color: "text-primary" },
    { label: "Countries Available", value: countriesCount, icon: Globe, color: "text-accent" },
    { label: "Top 100 Universities", value: top100Count, icon: Trophy, color: "text-amber-500" },
    { label: "Search Results", value: filtered.length, icon: Search, color: "text-emerald-500" },
  ];

  return (
    <CounselorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">University Search</h1>
          <p className="text-muted-foreground mt-1">
            Search and recommend universities to your students
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search university..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger><SelectValue placeholder="Program" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {allPrograms.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rankingFilter} onValueChange={setRankingFilter}>
                <SelectTrigger><SelectValue placeholder="Ranking" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rankings</SelectItem>
                  <SelectItem value="top10">Top 10</SelectItem>
                  <SelectItem value="top50">Top 50</SelectItem>
                  <SelectItem value="top100">Top 100</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">By Ranking</SelectItem>
                  <SelectItem value="budget">By Budget</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* University Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((uni) => (
            <Card
              key={uni.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              <CardContent className="p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground leading-tight">{uni.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{uni.country}</span>
                    </div>
                  </div>
                  {uni.partnered && (
                    <Badge className="shrink-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                      Partner
                    </Badge>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="text-muted-foreground">Rank</span>
                    <span className="font-semibold text-foreground ml-auto">#{uni.ranking}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-semibold text-foreground ml-auto">
                      ${uni.budget.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Programs */}
                <div className="flex items-start gap-2 mb-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {uni.programs.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs font-normal">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="flex items-start gap-2 mb-3 text-sm">
                  <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{uni.requirements}</span>
                </div>

                {/* Description */}
                <div className="flex items-start gap-2 mb-5 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-muted-foreground line-clamp-2">{uni.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Button
                    size="sm"
                    variant="gradient"
                    className="flex-1"
                    onClick={() => setRecommendModal(uni)}
                  >
                    <Send className="h-3.5 w-3.5" />
                    Recommend
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(uni.website, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No universities found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Recommend Modal */}
      <Dialog open={!!recommendModal} onOpenChange={() => setRecommendModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recommend University</DialogTitle>
            <DialogDescription>
              Select a student to recommend {recommendModal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => handleRecommend(student.name)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.program}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </CounselorLayout>
  );
};

export default UniversitySearch;
