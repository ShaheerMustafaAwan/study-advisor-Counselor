import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/profile";
import { decodeAuthToken, getAuthToken } from "@/api/http";

const getNameFromEmail = (email?: string | null) => {
  if (!email) return "";
  return email.split("@")[0] || "";
};

const toInitials = (name: string) => {
  const parts = String(name)
    .split(/[\s._-]/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "C";
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

export interface CounselorIdentity {
  displayName: string;
  initials: string;
  email: string | null;
  role: string | null;
}

export function useCounselorIdentity() {
  const payload = decodeAuthToken(getAuthToken());

  const query = useQuery({
    queryKey: ["counselor-identity"],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const identity = useMemo<CounselorIdentity>(() => {
    const backendUser = query.data?.profile?.user;
    const email = backendUser?.email || payload?.email || null;
    const role = backendUser?.role || payload?.role || null;

    const rawName =
      (backendUser?.fullName && backendUser.fullName.trim()) ||
      getNameFromEmail(email) ||
      "Counselor";

    return {
      displayName: rawName,
      initials: toInitials(rawName),
      email,
      role,
    };
  }, [payload?.email, payload?.role, query.data?.profile?.user]);

  return {
    ...query,
    identity,
  };
}
