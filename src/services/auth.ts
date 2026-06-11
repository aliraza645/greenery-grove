import { api } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
}

interface AuthResponse { user: AuthUser; token: string }

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function registerRequest(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function forgotPasswordRequest(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get("/auth/me");
  return data.user;
}
