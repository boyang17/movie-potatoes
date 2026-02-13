import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
