import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingPage from "../pages/Auth/LoadingPage";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;

  return !user ? children : <Navigate to="/" />;
};

export default PublicRoute;
