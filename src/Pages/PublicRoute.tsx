// src/Pages/PublicRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = sessionStorage.getItem("accessToken");

  // If token exists, redirect to dashboard or any protected page
  if (token) {
    return <Navigate to="/user-management" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
