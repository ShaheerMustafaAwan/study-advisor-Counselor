const RECOMMENDATION_API_BASE_URL =
  import.meta.env.VITE_RECOMMENDATION_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:4000/api";

export interface StudentProfileRequest {
  gpa: number;
  ielts_score?: number;
  toefl_score?: number;
  gre_score?: number;
  gmat_score?: number;
  experience_years: number;
  research_experience: boolean;
  publications_count: number;
  work_experience_relevant: boolean;
  leadership_experience: boolean;
  current_education_level: string;
  field_of_study: string;
  institution_name?: string;
  desired_program: string;
  preferred_countries: string[];
  budget_usd?: number;
  preferred_intake?: string;
  study_mode?: string;
}

export interface UniversityListResponse {
  id: number;
  name: string;
  country: string;
  world_ranking: number | null;
  acceptance_rate: number | null;
  website: string | null;
  description: string | null;
  min_gpa: number;
  min_ielts: number | null;
  min_toefl: number | null;
  min_gre: number | null;
  min_gmat: number | null;
  min_experience_years: number;
  program_name: string;
  program_level: string;
  program_type: string | null;
  program_duration_months: number | null;
  tuition_fee_usd: number;
  scholarship_available: boolean;
  avg_scholarship_percentage: number | null;
  fields_offered: string[];
  requires_portfolio: boolean;
  requires_research_proposal: boolean;
  requires_interview: boolean;
  application_deadline: string | null;
  intake_seasons: string[];
  graduation_rate?: number | null;
  employment_rate_6_months?: number | null;
  avg_starting_salary_usd?: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface UniversityRecommendationResponse {
  university: UniversityListResponse;
  match_score: number;
  eligibility_score: number;
  similarity_score: number;
  final_score: number;
  reasons: string[];
}

export interface RecommendationResponse {
  recommendations: UniversityRecommendationResponse[];
  total_considered: number;
  algorithm_version: string;
  processing_time_ms: number;
}

export interface UniversityUiCard {
  id: string;
  name: string;
  country: string;
  programLevel: string;
  rankingLabel: string;
  rankingValue: number | null;
  tuitionUsd: number;
  tuitionLabel: string;
  programs: string[];
  requirements: string;
  description: string;
  website: string;
  deadline: string;
  scholarshipAvailable: boolean;
  acceptanceRate: number | null;
  isRecommended: boolean;
  matchPercentage: number | null;
  reasons: string[];
  similarityScore: number | null;
  eligibilityScore: number | null;
}

function formatRequirements(university: UniversityListResponse): string {
  const parts: string[] = [];

  parts.push(`GPA ${university.min_gpa.toFixed(1)}+`);
  if (typeof university.min_ielts === "number") {
    parts.push(`IELTS ${university.min_ielts.toFixed(1)}+`);
  }
  if (typeof university.min_toefl === "number") {
    parts.push(`TOEFL ${university.min_toefl}+`);
  }
  if (typeof university.min_gre === "number") {
    parts.push(`GRE ${university.min_gre}+`);
  }
  if (typeof university.min_gmat === "number") {
    parts.push(`GMAT ${university.min_gmat}+`);
  }
  if (university.min_experience_years > 0) {
    parts.push(`${university.min_experience_years}+ yrs experience`);
  }

  return parts.join(", ");
}

export function convertToUniversityUiCard(
  university: UniversityListResponse,
  recommendation?: UniversityRecommendationResponse,
): UniversityUiCard {
  const programs =
    university.fields_offered && university.fields_offered.length > 0
      ? university.fields_offered
      : [university.program_name];

  return {
    id: String(university.id),
    name: university.name,
    country: university.country,
    programLevel: university.program_level,
    rankingLabel:
      typeof university.world_ranking === "number"
        ? `#${university.world_ranking} Global`
        : "Not Ranked",
    rankingValue: university.world_ranking,
    tuitionUsd: university.tuition_fee_usd,
    tuitionLabel: `$${university.tuition_fee_usd.toLocaleString("en-US")}`,
    programs,
    requirements: formatRequirements(university),
    description: university.description ?? "No description available.",
    website: university.website ?? "",
    deadline: university.application_deadline ?? "Rolling",
    scholarshipAvailable: university.scholarship_available,
    acceptanceRate: university.acceptance_rate,
    isRecommended: Boolean(recommendation),
    matchPercentage: recommendation
      ? Math.round(recommendation.final_score * 100)
      : null,
    reasons: recommendation?.reasons ?? [],
    similarityScore: recommendation?.similarity_score ?? null,
    eligibilityScore: recommendation?.eligibility_score ?? null,
  };
}

export const universityRecommendationsApi = {
  async getRecommendations(
    studentProfile: StudentProfileRequest,
    topK: number,
  ): Promise<RecommendationResponse> {
    const response = await fetch(
      `${RECOMMENDATION_API_BASE_URL}/recommendations/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_profile: studentProfile,
          top_k: topK,
        }),
      },
    );

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message =
        payload?.detail || payload?.message || "Failed to get recommendations";
      throw new Error(message);
    }

    return (await response.json()) as RecommendationResponse;
  },

  async getUniversities(filters?: {
    country?: string;
    program_level?: string;
  }): Promise<UniversityListResponse[]> {
    const params = new URLSearchParams();

    if (filters?.country) {
      params.set("country", filters.country);
    }
    if (filters?.program_level) {
      params.set("program_level", filters.program_level);
    }

    const query = params.toString();
    const url = `${RECOMMENDATION_API_BASE_URL}/universities/${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message =
        payload?.detail || payload?.message || "Failed to fetch universities";
      throw new Error(message);
    }

    return (await response.json()) as UniversityListResponse[];
  },

  async getUniversityById(id: number): Promise<UniversityListResponse> {
    const response = await fetch(
      `${RECOMMENDATION_API_BASE_URL}/universities/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message =
        payload?.detail || payload?.message || "Failed to fetch university";
      throw new Error(message);
    }

    return (await response.json()) as UniversityListResponse;
  },

  async getCountries(): Promise<string[]> {
    const universities = await universityRecommendationsApi.getUniversities();
    const unique = Array.from(
      new Set(universities.map((u) => String(u.country))),
    );
    return unique.sort((a, b) => a.localeCompare(b));
  },

  async getProgramLevels(): Promise<string[]> {
    const universities = await universityRecommendationsApi.getUniversities();
    const unique = Array.from(
      new Set(universities.map((u) => String(u.program_level))),
    );
    return unique.sort((a, b) => a.localeCompare(b));
  },
};
