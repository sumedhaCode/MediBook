import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: JSX.Element;
  role: "patient" | "doctor" | "admin";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useAuth();

  // ⏳ Still loading (important fix)
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role → redirect to correct dashboard
  if (user.role !== role) {
    if (user.role === "patient") return <Navigate to="/patient/search" replace />;
    if (user.role === "doctor") return <Navigate to="/doctor" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  // ✅ Correct role
  return children;
};

export default ProtectedRoute;