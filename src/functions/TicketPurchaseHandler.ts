import { API_BASE_URL } from "../config";
import type CartItem from "../data/CartItem";

interface payload {
  ticketId: number;
  quantity: number;
}

/**
 * Responsible for sending an update call to the backend
 * of the tickets that were bought, as well as the
 * amount per ticket.
 */
export default async function ticketPurchaseHandler(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    return;
  }

  const payloadData: payload[] = cartItems.map(item => ({
    ticketId: item.ticket.ticketId,
    quantity: item.amount
  }));
  console.log("Payload data:", payloadData);

  if (cartItems.length === 1) {
    try {
      await fetch(`${API_BASE_URL}/tickets/ticket/` + encodeURIComponent(cartItems[0].ticket.ticketId) + "/quantity/" + encodeURIComponent(cartItems[0].amount) + "/purchase", {
        method: "PUT"
      });
    } catch {
      console.error("Failed to update ticket quantity");
    }

  } else if (cartItems.length > 1) {
    try {
      await fetch(`${API_BASE_URL}/tickets/payload/purchase`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadData),
      });
    } catch {
      console.error("Failed to update ticket quantity");
    }

  }
}
