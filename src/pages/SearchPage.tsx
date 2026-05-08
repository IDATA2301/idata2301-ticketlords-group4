import { useSearchParams } from "react-router-dom"
import EventListPage from "./EventListPage";
import type Event from "../util/dtos/Event";


export default function SearchPage() {
  const [searchQuery] = useSearchParams();
  const query = searchQuery.get("query") || "";
  const fetchEvents = async (): Promise<Event[]> => {
    if (!query) return [];
    const response = await fetch("https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/search?query=" + encodeURIComponent(query));
    if (!response.ok) return [];
    return response.json();
  }
  return (
    <EventListPage
      title={"Results for \"" + query + "\""}
      fetchEvents={fetchEvents}
    />
  );
}
