import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
