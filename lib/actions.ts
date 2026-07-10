"use server"

import { cookies } from "next/headers";
import axios from "axios";

export async function setAuthSession(token: string, user: any) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  cookieStore.set("user_data", JSON.stringify(user), {
    httpOnly: true, // Accessible by JS for UI state
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user_data")?.value;
  return user ? JSON.parse(user) : null;
}
export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ;
}



export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user_data");
}

export  const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL }`,
  withCredentials: true, // Required to send HTTP-only cookies automatically
});