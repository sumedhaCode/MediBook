// src/lib/auth.ts
import API from "./api";

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  specialty?: string;
  experience?: number;
  location?: string;
  consultation?: number;
}) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", data);
};

// ✅ No token param needed — api.ts interceptor handles it
export const getMe = () => {
  return API.get("/auth/me");
};