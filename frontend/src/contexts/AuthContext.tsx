// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe } from "@/lib/auth";
import { UserRole } from "@/types";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Auto-login if token already exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Token is auto-attached by api.ts interceptor
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem("token");
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await loginUser({ email, password });

    const token = res.data.token;
    const userData = res.data.user;

    // Save token — api.ts will auto-attach it from now on
    localStorage.setItem("token", token);
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};