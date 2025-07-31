import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingPage from "../pages/Auth/LoadingPage";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;

  if (!user) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
