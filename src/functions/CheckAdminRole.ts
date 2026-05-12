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
      console.log("userId:", userId);

      if (!userId) {
        setIsAdmin(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/user/${userId}/is-admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("admin data:", data);
        setIsAdmin(data.isAdmin);
      } else {
        setIsAdmin(false);
        console.log("response not ok:", response.status, await response.text());
      }
    };

    checkAdmin();
  }, [locationPathname]);

  return isAdmin;
}
