import type Ticket from "../util/dtos/Ticket";

export default interface CartItem {
  ticket: Ticket;
  amount: number;
}
