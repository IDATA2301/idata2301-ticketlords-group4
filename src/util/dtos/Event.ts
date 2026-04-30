import type Category from "./Category";
import type EventVenue from "./EventVenue";
export default interface Event {
  eventId: number;
  eventName: string;
  host: string;
  category: Category;
  eventDateStart: Date;
  eventDateEnd: Date;
  eventVenue: EventVenue;
  eventDescription: string;
  totalClicks: number;
  imgPathUrl: String;
}
