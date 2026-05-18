import EventListPage from "./EventListPage";
import { useParams } from "react-router-dom";
import type Event from "../util/dtos/Event";
import { API_BASE_URL } from "../config";
import { getTokenFromStorage } from "../util/authUtils";
import { prettyCategoryName} from "../functions/PrettyCategoryName.ts";

/**
 * Page component that displays all events belonging to a specific category.
 * Reads the category slug from the URL parameters, converts it to a display
 * name, and fetches the matching events from the backend.
 *
 * @returns An {@link EventListPage} populated with events for the given category.
 */
export default function CategoryEventPage() {
  const params = useParams<{ categoryName: string }>();
  const category = params.categoryName;
  const categoryTitle: string = prettyCategoryName(category ?? "");

  /**
   * Fetches all events belonging to the current category from the backend.
   *
   * @returns A promise resolving to an array of {@link Event} objects,
   *          or an empty array if the category is missing or the request fails.
   */
  const fetchEvents = async (): Promise<Event[]> => {
    if (!category) return [];
    const token = getTokenFromStorage();
    const options: RequestInit = {};
    if (token) {
      options.headers = { "Authorization": `Bearer ${token}` };
    }
    const response = await fetch(`${API_BASE_URL}/events/category/` + encodeURIComponent(category), options);
    if (!response.ok) return [];
    return response.json();
  }

  return (
    <EventListPage
      title={categoryTitle ?? ""}
      fetchEvents={fetchEvents}
    />
  );
}
