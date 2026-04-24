import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: JSX.Element;
  role: "patient" | "doctor" | "admin";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useAuth();

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ Wrong role
  if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  // ✅ Correct role
  return children;
};

export default ProtectedRoute;