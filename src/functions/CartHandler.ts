import type Cart from "../data/Cart";
import type CartItem from "../data/CartItem";

const CART_KEY: string = "cart";

/**
 * Retrieves the cart from localStorage.
 *
 * @returns {Cart} The current cart, or an empty cart if none exists.
 */
export function getCart(): Cart {
  try {
    const cart = localStorage.getItem(CART_KEY);
    if (cart && cart !== null) {
      return JSON.parse(cart) as Cart;
    } else {
      return { items: [] };
    }
  }
  catch {
    return { items: [] };
  }
}

/**
 * Updates the cart with the provided cart.
 *
 * @param {Cart} cart - The cart to be saved.
 */
export function saveCart(cart: Cart) {
  if (cart !== null) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
}

/**
 * Adds a {@link CartItem} to the localStorage. If it already exists, increment the amount.
 *
 * @param {CartItem} cartItem - The item to be added to the cart.
 */
export function addToCart(cartItem: CartItem) {
  const cart = getCart();
  const existing = cart.items.find((i) => i.ticket.ticketId === cartItem.ticket.ticketId);
  if (existing) {
    existing.amount += cartItem.amount;
  } else {
    cart.items.push(cartItem);
    saveCart(cart);
  }
}

/**
 * Removes a CartItem from the cart by ticketId. Clears the cart if it is empty after removal.
 *
 * @param {number} ticketId - The ID of the ticket to be removed from the cart.
 */
export function removeFromCart(ticketId: number) {
  const cart = getCart();
  const existing = cart.items.find((i) => i.ticket.ticketId === ticketId);
  if (existing) {
    cart.items = cart.items.filter((i) => i.ticket.ticketId !== ticketId);
    saveCart(cart);
  }
  if (cart.items.length === 0) {
    clearCart();
  }
}


/**
 * Removes the cart from localStorage.
 */
function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/**
 * Gets the amount of items in the cart.
 *
 * @returns The total amount of items in the cart.
 */
export function getCartCount() {
  const cart = getCart();
  return cart.items.reduce((total: number, item: CartItem) => total + item.amount, 0);
}

/**
 * Gets the total cost of all tickets in the cart.
 *
 * @returns The total cost of all tickets in the cart.
 */
export function getCartTotalCost(): number {
  return getCart().items.reduce((total: number, i: CartItem) => total + (i.ticket.price * i.amount), 0);
}


