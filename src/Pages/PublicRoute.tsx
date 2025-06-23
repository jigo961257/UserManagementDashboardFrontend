// src/Pages/PublicRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/user-management" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
