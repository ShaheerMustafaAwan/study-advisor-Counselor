import { useEffect, useMemo, useState } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { students } from "@/data/students";
import {
  convertToUniversityUiCard,
  type StudentProfileRequest,
  type UniversityUiCard,
} from "@/api/universityRecommendations";
import { useUniversityRecommendations } from "@/hooks/useUniversityRecommendations";
import { useUniversities } from "@/hooks/useUniversities";

const DEFAULT_PROFILE: StudentProfileRequest = {
  gpa: 3.2,
  ielts_score: 6.5,
  experience_years: 0,
  research_experience: false,
  publications_count: 0,
  work_experience_relevant: false,
  leadership_experience: false,
  current_education_level: "BACHELORS",
  field_of_study: "Computer Science",
  desired_program: "MASTERS",
  preferred_countries: [],
  budget_usd: 25000,
  study_mode: "FULL_TIME",
};

const UniversitySearch = () => {
  const [activeTab, setActiveTab] = useState<"recommended" | "browse">(
    "recommended",
  );
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(true);
  const [profileTopK, setProfileTopK] = useState("10");
  const [preferredCountriesInput, setPreferredCountriesInput] = useState("");
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileRequest>(DEFAULT_PROFILE);

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"ranking" | "budget" | "name">(
    "ranking",
  );

  const [savedUniversities, setSavedUniversities] = useState<string[]>([]);
  const [recommendModal, setRecommendModal] = useState<UniversityUiCard | null>(
    null,
  );

  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    hasRequested,
    hasRecommendations,
    getRecommendations,
    clearRecommendations,
  } = useUniversityRecommendations({
    onSuccess: () => {
      setActiveTab("recommended");
      setIsProfileFormOpen(false);
    },
  });

  const {
    universities: browseUniversities,
    loading: browseLoading,
    error: browseError,
    countries,
    programLevels,
    fetchUniversities,
  } = useUniversities({ autoFetch: false });

  useEffect(() => {
    const savedRaw = localStorage.getItem("counselorSavedUniversities");
    if (savedRaw) {
      setSavedUniversities(JSON.parse(savedRaw) as string[]);
    }
  }, []);

  const recommendedCards = useMemo(
    () =>
      recommendations?.recommendations.map((item) =>
        convertToUniversityUiCard(item.university, item),
      ) ?? [],
    [recommendations],
  );

  const browseCards = useMemo(
    () => browseUniversities.map((uni) => convertToUniversityUiCard(uni)),
    [browseUniversities],
  );

  const filtered = useMemo(() => {
    const source = activeTab === "recommended" ? recommendedCards : browseCards;

    const filteredCards = source.filter((u) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        u.name.toLowerCase().includes(query) ||
        u.country.toLowerCase().includes(query) ||
        u.programs.some((program) => program.toLowerCase().includes(query));

      const matchesCountry =
        countryFilter === "all" || u.country === countryFilter;

      const matchesProgram =
        programFilter === "all" ||
        u.programLevel.toLowerCase() === programFilter.toLowerCase();

      const matchesBudget =
        budgetFilter === "all" ||
        (budgetFilter === "low" && u.tuitionUsd <= 10000) ||
        (budgetFilter === "medium" &&
          u.tuitionUsd > 10000 &&
          u.tuitionUsd <= 35000) ||
        (budgetFilter === "high" && u.tuitionUsd > 35000);

      return matchesSearch && matchesCountry && matchesProgram && matchesBudget;
    });

    filteredCards.sort((a, b) => {
      if (sortBy === "ranking") {
        if (a.rankingValue === null && b.rankingValue === null) return 0;
        if (a.rankingValue === null) return 1;
        if (b.rankingValue === null) return -1;
        return a.rankingValue - b.rankingValue;
      }

      if (sortBy === "budget") {
        return a.tuitionUsd - b.tuitionUsd;
      }

      return a.name.localeCompare(b.name);
    });

    return filteredCards;
  }, [
    activeTab,
    browseCards,
    budgetFilter,
    countryFilter,
    programFilter,
    recommendedCards,
    search,
    sortBy,
  ]);

  const stats = [
    {
      label: "Recommended Results",
      value: recommendedCards.length,
      icon: Sparkles,
      color: "text-primary",
    },
    {
      label: "Browse Universities",
      value: browseCards.length,
      icon: Building2,
      color: "text-accent",
    },
    {
      label: "Countries Available",
      value: countries.length,
      icon: Globe,
      color: "text-emerald-500",
    },
    {
      label: "Visible Results",
      value: filtered.length,
      icon: Search,
      color: "text-amber-500",
    },
  ];

  const updatePreferredCountries = (input: string) => {
    setPreferredCountriesInput(input);

    const parsed = input
      .split(",")
      .map((country) => country.trim())
      .filter(Boolean);

    setStudentProfile((prev) => ({
      ...prev,
      preferred_countries: parsed,
    }));
  };

  const updateNumericField = (
    key:
      | "gpa"
      | "ielts_score"
      | "toefl_score"
      | "gre_score"
      | "gmat_score"
      | "experience_years"
      | "publications_count"
      | "budget_usd",
    value: string,
  ) => {
    const parsed = value.trim() === "" ? undefined : Number(value);

    setStudentProfile((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? undefined : parsed,
    }));
  };

  const handleGenerateRecommendations = async () => {
    if (!studentProfile.field_of_study.trim()) {
      toast.error("Field of study is required.");
      return;
    }

    const topKNumber = Number(profileTopK);
    if (Number.isNaN(topKNumber) || topKNumber < 1 || topKNumber > 20) {
      toast.error("Top K must be between 1 and 20.");
      return;
    }

    try {
      await getRecommendations(studentProfile, topKNumber);
      toast.success("Recommendations generated successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate recommendations";
      toast.error(message);
    }
  };

  const handleClearRecommendations = () => {
    clearRecommendations();
    setSearch("");
    setCountryFilter("all");
    setProgramFilter("all");
    setBudgetFilter("all");
    setSortBy("ranking");
    toast.success("Recommendation state cleared.");
  };

  const handleOpenBrowse = async () => {
    setActiveTab("browse");
    if (browseCards.length > 0) {
      return;
    }

    try {
      await fetchUniversities();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load universities";
      toast.error(message);
    }
  };

  const handleSaveUniversity = (id: string) => {
    setSavedUniversities((prev) => {
      const next = prev.includes(id)
        ? prev.filter((value) => value !== id)
        : [...prev, id];

      localStorage.setItem("counselorSavedUniversities", JSON.stringify(next));
      return next;
    });
  };

  const handleRecommend = (studentName: string) => {
    toast.success(`${recommendModal?.name} recommended to ${studentName}`);
    setRecommendModal(null);
  };

  const showLoading =
    (activeTab === "recommended" && recommendationsLoading) ||
    (activeTab === "browse" && browseLoading);

  return (
    <CounselorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            University Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate recommendations from runtime profile input and browse all
            universities from the recommendation service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4 flex flex-wrap gap-3">
            <Button
              variant={activeTab === "recommended" ? "default" : "outline"}
              onClick={() => setActiveTab("recommended")}
              className="min-w-40"
            >
              <Sparkles className="h-4 w-4" />
              Recommended
              {hasRecommendations && (
                <Badge className="ml-1 bg-primary/20 text-primary border-primary/30">
                  {recommendedCards.length}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === "browse" ? "default" : "outline"}
              onClick={handleOpenBrowse}
              className="min-w-40"
            >
              <Building2 className="h-4 w-4" />
              Browse All
              <Badge className="ml-1 bg-secondary text-secondary-foreground border-transparent">
                {browseCards.length}
              </Badge>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Counselor Input Form</CardTitle>
                <CardDescription>
                  Fill this form on the same page, submit, then update any field
                  and regenerate to compare recommendation changes in runtime.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileFormOpen((prev) => !prev)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {isProfileFormOpen ? "Hide Form" : "Open Form"}
              </Button>
            </div>
          </CardHeader>

          {isProfileFormOpen && (
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={studentProfile.gpa}
                    onChange={(e) => updateNumericField("gpa", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ielts">IELTS</Label>
                  <Input
                    id="ielts"
                    type="number"
                    step="0.1"
                    min="0"
                    max="9"
                    value={studentProfile.ielts_score ?? ""}
                    onChange={(e) =>
                      updateNumericField("ielts_score", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={studentProfile.experience_years}
                    onChange={(e) =>
                      updateNumericField("experience_years", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={studentProfile.budget_usd ?? ""}
                    onChange={(e) =>
                      updateNumericField("budget_usd", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Current Education Level</Label>
                  <Select
                    value={studentProfile.current_education_level}
                    onValueChange={(value) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        current_education_level: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH_SCHOOL">HIGH_SCHOOL</SelectItem>
                      <SelectItem value="BACHELORS">BACHELORS</SelectItem>
                      <SelectItem value="MASTERS">MASTERS</SelectItem>
                      <SelectItem value="PHD">PHD</SelectItem>
                      <SelectItem value="POST_DOCTORAL">
                        POST_DOCTORAL
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Desired Program</Label>
                  <Select
                    value={studentProfile.desired_program}
                    onValueChange={(value) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        desired_program: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BACHELORS">BACHELORS</SelectItem>
                      <SelectItem value="MASTERS">MASTERS</SelectItem>
                      <SelectItem value="PHD">PHD</SelectItem>
                      <SelectItem value="POST_DOCTORAL">
                        POST_DOCTORAL
                      </SelectItem>
                      <SelectItem value="DIPLOMA">DIPLOMA</SelectItem>
                      <SelectItem value="FOUNDATION">FOUNDATION</SelectItem>
                      <SelectItem value="PG_DIPLOMA">PG_DIPLOMA</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="RESEARCH_MASTERS">
                        RESEARCH_MASTERS
                      </SelectItem>
                      <SelectItem value="EXECUTIVE_EDUCATION">
                        EXECUTIVE_EDUCATION
                      </SelectItem>
                      <SelectItem value="RESEARCH_FELLOWSHIP">
                        RESEARCH_FELLOWSHIP
                      </SelectItem>
                      <SelectItem value="EXCHANGE">EXCHANGE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Study Mode</Label>
                  <Select
                    value={studentProfile.study_mode ?? "FULL_TIME"}
                    onValueChange={(value) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        study_mode: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">FULL_TIME</SelectItem>
                      <SelectItem value="PART_TIME">PART_TIME</SelectItem>
                      <SelectItem value="ONLINE">ONLINE</SelectItem>
                      <SelectItem value="HYBRID">HYBRID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Top Recommendations</Label>
                  <Select value={profileTopK} onValueChange={setProfileTopK}>
                    <SelectTrigger>
                      <SelectValue placeholder="Top K" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Top 5</SelectItem>
                      <SelectItem value="10">Top 10</SelectItem>
                      <SelectItem value="15">Top 15</SelectItem>
                      <SelectItem value="20">Top 20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    value={studentProfile.field_of_study}
                    onChange={(e) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        field_of_study: e.target.value,
                      }))
                    }
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countries">
                    Preferred Countries (comma separated)
                  </Label>
                  <Input
                    id="countries"
                    value={preferredCountriesInput}
                    onChange={(e) => updatePreferredCountries(e.target.value)}
                    placeholder="Canada, Germany, Australia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="research">Research Experience</Label>
                  <Switch
                    id="research"
                    checked={studentProfile.research_experience}
                    onCheckedChange={(checked) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        research_experience: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="work">Relevant Work Experience</Label>
                  <Switch
                    id="work"
                    checked={studentProfile.work_experience_relevant}
                    onCheckedChange={(checked) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        work_experience_relevant: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="leadership">Leadership Experience</Label>
                  <Switch
                    id="leadership"
                    checked={studentProfile.leadership_experience}
                    onCheckedChange={(checked) =>
                      setStudentProfile((prev) => ({
                        ...prev,
                        leadership_experience: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleGenerateRecommendations}
                  disabled={recommendationsLoading}
                  variant="gradient"
                >
                  {recommendationsLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      Generate Recommendations
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClearRecommendations}
                  disabled={!hasRequested && !hasRecommendations}
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Recommendation State
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by university, country or program"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Program Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Program Levels</SelectItem>
                  {programLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="low">Low (&lt;= $10K)</SelectItem>
                  <SelectItem value="medium">Medium ($10K - $35K)</SelectItem>
                  <SelectItem value="high">High (&gt; $35K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <CircleDollarSign className="h-3.5 w-3.5" />
                Budget filter
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Program level filter
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Search className="h-3.5 w-3.5" />
                Smart search
              </Badge>

              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as "ranking" | "budget" | "name")
                }
              >
                <SelectTrigger className="ml-auto w-44">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">Sort: Ranking</SelectItem>
                  <SelectItem value="budget">Sort: Budget</SelectItem>
                  <SelectItem value="name">Sort: Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {showLoading && (
          <div className="rounded-lg border bg-card p-10 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="font-medium text-foreground">
              {activeTab === "recommended"
                ? "Generating recommendations"
                : "Loading universities"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please wait a few seconds...
            </p>
          </div>
        )}

        {activeTab === "recommended" &&
          recommendationsError &&
          !recommendationsLoading && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-5">
              <p className="font-semibold text-foreground">
                Recommendation Error
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {recommendationsError.message}
              </p>
            </div>
          )}

        {activeTab === "browse" && browseError && !browseLoading && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-5">
            <p className="font-semibold text-foreground">Browse Error</p>
            <p className="text-sm text-muted-foreground mt-1">
              {browseError.message}
            </p>
          </div>
        )}

        {activeTab === "recommended" &&
          hasRecommendations &&
          !recommendationsLoading && (
            <div className="rounded-lg border bg-card p-4 flex flex-wrap items-center gap-3 text-sm">
              <Badge className="bg-primary/15 text-primary border-primary/20">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Generated {recommendedCards.length} recommendations
              </Badge>
              <span className="text-muted-foreground">
                Considered {recommendations?.total_considered} universities in{" "}
                {Math.round(recommendations?.processing_time_ms ?? 0)}ms
              </span>
            </div>
          )}

        {!showLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((uni) => (
              <Card
                key={uni.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground leading-tight">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{uni.country}</span>
                      </div>
                    </div>
                    {uni.isRecommended ? (
                      <Badge className="shrink-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                        Match {uni.matchPercentage}%
                      </Badge>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-muted-foreground">Rank</span>
                      <span className="font-semibold text-foreground ml-auto">
                        {uni.rankingLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CircleDollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="text-muted-foreground">Tuition</span>
                      <span className="font-semibold text-foreground ml-auto">
                        {uni.tuitionLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {uni.programs.map((program) => (
                        <Badge
                          key={program}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {program}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3 text-sm">
                    <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      {uni.requirements}
                    </span>
                  </div>

                  {uni.isRecommended && uni.reasons.length > 0 && (
                    <div className="mb-3 rounded-md bg-primary/5 border border-primary/15 p-2.5 text-xs text-primary">
                      <div className="font-medium mb-1">Why recommended</div>
                      <ul className="space-y-1">
                        {uni.reasons.slice(0, 2).map((reason) => (
                          <li key={reason}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-start gap-2 mb-5 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-muted-foreground line-clamp-2">
                      {uni.description}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      size="sm"
                      variant={
                        savedUniversities.includes(uni.id)
                          ? "default"
                          : "gradient"
                      }
                      className="flex-1"
                      onClick={() => handleSaveUniversity(uni.id)}
                    >
                      <Star className="h-3.5 w-3.5" />
                      {savedUniversities.includes(uni.id) ? "Saved" : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setRecommendModal(uni)}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Recommend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-w-28"
                      onClick={() => {
                        if (uni.website) {
                          window.open(
                            uni.website,
                            "_blank",
                            "noopener,noreferrer",
                          );
                        }
                      }}
                      disabled={!uni.website}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!showLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">
              {activeTab === "recommended"
                ? "No recommendations found"
                : "No universities found"}
            </p>
            <p className="text-sm">
              {activeTab === "recommended"
                ? "Update the form and generate again to see different recommendations"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={!!recommendModal}
        onOpenChange={() => setRecommendModal(null)}
      >
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
                  {student.name
                    .split(" ")
                    .map((namePart) => namePart[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {student.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.program}
                  </p>
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
