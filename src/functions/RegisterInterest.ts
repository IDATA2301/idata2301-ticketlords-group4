import { API_BASE_URL } from "../config";
import type UserInterest from "../util/dtos/UserInterest";
import type Event from "../util/dtos/Event";

/**
 * Registers a click on an event by a user.
 */
export default function registerInterest(categoryId: number, userId: number) {

  try {
    fetch(`${API_BASE_URL}/api/user/${userId}/${categoryId}/interest/add`, {
      method: "POST",
      credentials: "include"
    });
  } catch {
    console.error("Failed to register event click");
  }
}
