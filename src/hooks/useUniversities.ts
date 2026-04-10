import { useCallback, useEffect, useState } from "react";
import {
  type UniversityListResponse,
  universityRecommendationsApi,
} from "@/api/universityRecommendations";

interface UniversityFilters {
  country?: string;
  program_level?: string;
}

interface UseUniversitiesProps {
  filters?: UniversityFilters;
  autoFetch?: boolean;
}

export function useUniversities({
  filters,
  autoFetch = false,
}: UseUniversitiesProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [universities, setUniversities] = useState<UniversityListResponse[]>(
    [],
  );
  const [countries, setCountries] = useState<string[]>([]);
  const [programLevels, setProgramLevels] = useState<string[]>([]);

  const fetchUniversities = useCallback(
    async (customFilters?: UniversityFilters) => {
      setLoading(true);
      setError(null);

      try {
        const data = await universityRecommendationsApi.getUniversities(
          customFilters ?? filters,
        );
        setUniversities(data);

        const computedCountries = Array.from(
          new Set(data.map((u) => u.country)),
        ).sort((a, b) => a.localeCompare(b));
        const computedProgramLevels = Array.from(
          new Set(data.map((u) => u.program_level)),
        ).sort((a, b) => a.localeCompare(b));

        setCountries(computedCountries);
        setProgramLevels(computedProgramLevels);

        return data;
      } catch (err) {
        const parsedError =
          err instanceof Error
            ? err
            : new Error("Failed to fetch universities");
        setError(parsedError);
        throw parsedError;
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const fetchFilters = useCallback(async () => {
    try {
      const [countriesData, levelsData] = await Promise.all([
        universityRecommendationsApi.getCountries(),
        universityRecommendationsApi.getProgramLevels(),
      ]);
      setCountries(countriesData);
      setProgramLevels(levelsData);
      return { countries: countriesData, levels: levelsData };
    } catch {
      return { countries: [], levels: [] };
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      void fetchUniversities();
    }
  }, [autoFetch, fetchUniversities]);

  return {
    loading,
    error,
    universities,
    countries,
    programLevels,
    fetchUniversities,
    fetchFilters,
    refetch: () => fetchUniversities(),
    totalCount: universities.length,
  };
}
