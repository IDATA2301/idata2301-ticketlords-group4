import { useSearchParams } from "react-router-dom"
import EventListPage from "./EventListPage";
import type Event from "../util/dtos/Event";
import { API_BASE_URL } from "../config";


export default function SearchPage() {
  const [searchQuery] = useSearchParams();
  const query = searchQuery.get("query") || "";
  const fetchEvents = async (): Promise<Event[]> => {
    if (!query) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/events/search?query=` + encodeURIComponent(query));
      if (!response.ok) return [];
      return response.json();
    } catch {
      return [];
    }

  }
  return (
    <EventListPage
      title={"Results for \"" + query + "\""}
      fetchEvents={fetchEvents}
    />
  );
}
