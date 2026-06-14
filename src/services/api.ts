import axios from "axios";

// Set VITE_API_URL=http://localhost:5000/api in .env to target the Express backend.
const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "eplant-auth";

api.interceptors.request.use((cfg) => {
  if (typeof window === "undefined") return cfg;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return cfg;
});

export function apiErrorMessage(err: unknown, fallback = "Request failed") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = err as any;
  const data = e?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors)[0];
    if (typeof first === "string") return `${data.message ? data.message + ": " : ""}${first}`;
  }
  return data?.message ?? e?.message ?? fallback;
}
