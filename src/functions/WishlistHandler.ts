import { API_BASE_URL } from "../config";

/**
 * Saves the wishlist to the database, by sending a POST request to the backend with the userId and eventId.
 */
export async function saveWishlistToDatabase(userId: number, eventId: number, token: string): Promise<void> {
  fetch(`${API_BASE_URL}/wishlists/user/${userId}/event/${eventId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    credentials: "include"
  });
}

/**
 * Deletes the wishlist from the database, by sending a DELETE request to the backend with the userId and eventId.
 */
export async function deleteWishlistFromDatabase(userId: number, eventId: number, token: string) {
  fetch(`${API_BASE_URL}/wishlists/user/${userId}/event/${eventId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    credentials: "include"
  });
}


