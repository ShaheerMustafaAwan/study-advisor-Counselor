import { useCallback, useState } from "react";
import {
  type RecommendationResponse,
  type StudentProfileRequest,
  universityRecommendationsApi,
} from "@/api/universityRecommendations";

interface UseUniversityRecommendationsProps {
  onSuccess?: (data: RecommendationResponse) => void;
  onError?: (error: Error) => void;
}

export function useUniversityRecommendations(
  options: UseUniversityRecommendationsProps = {},
) {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  const getRecommendations = useCallback(
    async (studentProfile: StudentProfileRequest, topK = 5) => {
      setLoading(true);
      setError(null);
      setHasRequested(true);

      try {
        const data = await universityRecommendationsApi.getRecommendations(
          studentProfile,
          topK,
        );
        setRecommendations(data);
        onSuccess?.(data);
        return data;
      } catch (err) {
        const parsedError =
          err instanceof Error
            ? err
            : new Error("Failed to get recommendations");
        setError(parsedError);
        onError?.(parsedError);
        throw parsedError;
      } finally {
        setLoading(false);
      }
    },
    [onError, onSuccess],
  );

  const clearRecommendations = useCallback(() => {
    setRecommendations(null);
    setError(null);
    setHasRequested(false);
  }, []);

  return {
    loading,
    error,
    recommendations,
    hasRequested,
    hasRecommendations: Boolean(recommendations?.recommendations.length),
    getRecommendations,
    clearRecommendations,
  };
}
