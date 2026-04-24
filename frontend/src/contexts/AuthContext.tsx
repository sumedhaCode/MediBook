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

  // 🔁 Auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getMe(token)
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  // 🔐 Login function
  const login = async (email: string, password: string): Promise<User> => {
    const res = await loginUser({ email, password });

    const token = res.data.token;
    localStorage.setItem("token", token);

    const userRes = await getMe(token);
    const userData = userRes.data;
    setUser(userData);
    
    return userData;
  };

  // 🚪 Logout
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