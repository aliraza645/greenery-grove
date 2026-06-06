import axios from "axios";

// Wire to your Express/MongoDB backend by setting VITE_API_URL in .env
const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT later: api.interceptors.request.use(cfg => { cfg.headers.Authorization = `Bearer ${token}`; return cfg; })
