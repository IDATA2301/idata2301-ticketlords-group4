import useIsAdminRole from "../functions/CheckAdminRole.ts";
import {Navigate} from "react-router-dom";

/**
 * Route guard that renders the provided content only when the current user has an admin role.
 *
 * @param param0
 * @param param0.children
 * @constructor
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdminRole();

  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/home" replace />;
  return children;
}