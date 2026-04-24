import type Category from "./Category";
import type EventVenue from "./EventVenue";
export default interface Event {
  eventId: number;
  eventName: String;
  host: String;
  category: Category;
  eventDateStart: Date;
  eventDateEnd: Date;
  eventVenue: EventVenue;
  eventDescription: String;
  totalClicks: number;
}
