import {useEffect, useState} from "react";
import {getUserIdFromToken} from "../util/authUtils.ts";
import {API_BASE_URL} from "../config.ts";

/**
 * Checks if a registered user is an admin.
 *
 * @param locationPathname
 */
export default function useIsAdminRole(locationPathname: string) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const userId = getUserIdFromToken();

      if (!userId) {
        setIsAdmin(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/user/${userId}/is-admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [locationPathname]);

  return isAdmin;
}
