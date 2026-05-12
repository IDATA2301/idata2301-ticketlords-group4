import useIsAdminRole from "../functions/CheckAdminRole.ts";
import {Navigate, useLocation} from "react-router-dom";
import React from "react";

/**
 * Route guard that renders the provided content only when the current user has an admin role.
 *
 * @param param0
 * @param param0.children
 * @constructor
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = useIsAdminRole(location.pathname);

  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/home" replace />;
  return children;
}