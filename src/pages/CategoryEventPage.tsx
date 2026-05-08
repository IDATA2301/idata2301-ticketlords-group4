import EventListPage from "./EventListPage";
import { useParams } from "react-router-dom";
import type Event from "../util/dtos/Event";


export default function CategoryEventPage() {
  const params = useParams<{ categoryName: string }>();
  const category = params.categoryName;

  const prettyCategoryName = (categoryName: string) => {
    if (!categoryName) return "";
    if (categoryName.includes("-")) {
      categoryName = categoryName.replaceAll("-", " ");
    }
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  }
  const categoryTitle: string = prettyCategoryName(category ?? "");

  const fetchEvents = async (): Promise<Event[]> => {
    if (!category) return [];
    const response = await fetch("https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/category/" + encodeURIComponent(category));
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
