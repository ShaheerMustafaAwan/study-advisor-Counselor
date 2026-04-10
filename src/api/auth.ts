import { httpPost } from "@/api/http";

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
}

export async function login(email: string, password: string) {
  return httpPost<LoginResponse>("/auth/login", {
    email,
    password,
  });
}
