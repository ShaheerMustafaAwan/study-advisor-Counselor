const RECOMMENDATION_API_BASE_URL =
  import.meta.env.VITE_RECOMMENDATION_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:4000/api";

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function getRecommendationApiBases(): string[] {
  const rawBases = [
    RECOMMENDATION_API_BASE_URL,
    import.meta.env.VITE_API_BASE_URL,
  ].filter((value): value is string => Boolean(value && value.trim()));

  const bases = new Set<string>();

  for (const base of rawBases) {
    const normalized = normalizeBaseUrl(base);
    bases.add(normalized);

    // Local dev safety-net: if 4000 points to stale service, retry 4010.
    if (/localhost:4000|127\.0\.0\.1:4000/i.test(normalized)) {
      bases.add(normalized.replace(/:4000/i, ":4010"));
    }
  }

  return Array.from(bases);
}

async function parseApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string" && data.detail.trim()) {
      return data.detail;
    }
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    // Ignore parse errors and fallback to response text.
  }

  try {
    const text = await response.text();
    if (text.trim()) {
      return text;
    }
  } catch {
    // Ignore text parse errors and return fallback.
  }

  return fallback;
}

async function fetchRecommendationApi(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const bases = getRecommendationApiBases();
  let lastError = "Recommendation service is unavailable";

  for (let i = 0; i < bases.length; i += 1) {
    const base = bases[i];
    const isLast = i === bases.length - 1;

    try {
      const response = await fetch(`${base}${path}`, init);

      if (response.ok) {
        return response;
      }

      const errorMessage = await parseApiError(
        response,
        `Request failed with status ${response.status}`,
      );
      lastError = errorMessage;

      const endpointNotFound =
        response.status === 404 && /endpoint not found/i.test(errorMessage);

      if (!isLast && endpointNotFound) {
        continue;
      }

      throw new Error(errorMessage);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (!isLast) {
        continue;
      }
    }
  }

  throw new Error(lastError);
}

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
    topK = 5,
  ): Promise<RecommendationResponse> {
    const response = await fetchRecommendationApi("/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_profile: studentProfile,
        top_k: topK,
      }),
    });

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
    const path = `/universities${query ? `?${query}` : ""}`;
    const response = await fetchRecommendationApi(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return (await response.json()) as UniversityListResponse[];
  },

  async getUniversityById(id: number): Promise<UniversityListResponse> {
    const response = await fetchRecommendationApi(`/universities/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
