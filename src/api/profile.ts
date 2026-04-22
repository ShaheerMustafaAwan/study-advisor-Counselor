import { httpGet } from "@/api/http";

export interface ProfileUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface ProfilePayload {
  user?: ProfileUser;
}

export interface GetProfileResponse {
  status: string;
  message: string;
  profile: ProfilePayload | null;
}

export async function getProfile() {
  return httpGet<GetProfileResponse>("/profile");
}
