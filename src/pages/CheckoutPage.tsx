import { useState } from "react";
import { getCart, getCartTotalCost, getTicketCountInCart } from "../functions/CartHandler";
import CartSummary from "../components/CartSummary";

export default function CheckoutPage() {

  const [email, setEmail] = useState("user@example.com");

  const cartItems = getCart().items;
  const totalCost = getCartTotalCost();
  const pricePreTax = totalCost * 0.75;
  const taxPrice = totalCost * 0.25;
  const itemCount = cartItems.reduce((sum, item) => sum + item.amount, 0);



  return (
    <div className="checkout-page">
      <div className="checkout-top">Cart</div>
      <div className="checkout-left-side">
        <CartSummary showCheckoutButton={false}
          totalCost={getCartTotalCost()}
          pricePreTax={getCartTotalCost() * 0.75}
          taxPrice={getCartTotalCost() * 0.25}
          itemCount={getTicketCountInCart()} />
        <input
          className="email-field"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="checkout-right-side"></div>
    </div>
  )
}
