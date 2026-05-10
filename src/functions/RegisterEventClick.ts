import { API_BASE_URL } from "../config";

/**
 * Registers a click on an event by a user.
 */
export default function registerEventClick(eventId: number, userId: number) {
  try {
    fetch(`${API_BASE_URL}/api/event-clicks/${eventId}/${userId}`, {
      method: "POST",
      credentials: "include"
    });
  } catch {
    console.error("Failed to register event click");
  }
}
