import { useState } from "react";

export default function CheckoutPage() {

  const [email, setEmail] = useState("user@example.com");



  return (
    <div className="checkout-page">
      <div className="checkout-top">Cart</div>
      <div className="checkout-left-side">
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
