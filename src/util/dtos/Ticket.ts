import type Event from "./Event";

export default interface Ticket {
  ticketId: number;
  event: Event;
  ticketType: string;
  price: number;
  amountAvailable: number;
  ticketDescription: string;
}
