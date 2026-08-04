import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth();

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
