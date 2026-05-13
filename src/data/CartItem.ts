import type Ticket from "../util/dtos/Ticket";

/**
 * Represents an item in the shopping cart, containing a ticket and the quantity of that ticket.
 */
export default interface CartItem {
  ticket: Ticket;
  amount: number;
}
