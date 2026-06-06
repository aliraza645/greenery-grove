// import { api } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// TODO swap to: const { data } = await api.post("/auth/login", { email, password }); return data;
export async function loginRequest(email: string, _password: string): Promise<{ user: AuthUser; token: string }> {
  return Promise.resolve({
    user: { id: "u_1", name: email.split("@")[0] || "Friend", email },
    token: "mock-jwt-token",
  });
}

// TODO swap to: api.post("/auth/register", ...)
export async function registerRequest(name: string, email: string, _password: string) {
  return Promise.resolve({ user: { id: "u_1", name, email }, token: "mock-jwt-token" });
}

// TODO swap to: api.post("/auth/forgot-password", { email })
export async function forgotPasswordRequest(_email: string) {
  return Promise.resolve({ ok: true });
}
