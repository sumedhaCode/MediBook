import API from "./api";

// REGISTER
export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  return API.post("/auth/register", data);
};

// LOGIN
export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return API.post("/auth/login", data);
};

// GET CURRENT USER
export const getMe = (token: string) => {
  return API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};