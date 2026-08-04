import { Navigate, Outlet } from "react-router-dom";

import Loader from "../components/ui/Loader";
import useAuth from "../hooks/useAuth";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
