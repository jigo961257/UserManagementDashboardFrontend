// src/Pages/RoleRoute.tsx
import { Navigate, Outlet, useParams } from "react-router-dom";

interface RoleRouteProps {
  allowedRoles: string[];         // e.g. ["admin"]
  redirectTo?: string;            // where to send if not allowed
}

export default function RoleRoute({
  allowedRoles,
  redirectTo = "/",
}: RoleRouteProps) {
  const { role } = useParams<{ role: string }>();
  const storedRole = sessionStorage.getItem("roleName");

  // Ensure URL param matches stored role and is in allowedRoles
  const isAllowed =
    storedRole &&
    role === storedRole &&
    allowedRoles.includes(storedRole);

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
