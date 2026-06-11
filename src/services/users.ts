import { api } from "./api";

export interface ServerUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export async function fetchUsers(): Promise<ServerUser[]> {
  const { data } = await api.get("/users");
  return data;
}
