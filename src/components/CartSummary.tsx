import { useState } from "react";
import type CartItem from "../data/CartItem";
import { getCartTotalCost } from "../functions/CartHandler";
import { useNavigate } from "react-router-dom";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  totalCost: number;
  pricePreTax: number;
  taxPrice: number;
  itemCount: number;
}

export default function CartSummary({ showCheckoutButton = true, totalCost, pricePreTax, taxPrice, itemCount }: CartSummaryProps) {

  const navigate = useNavigate();

  return (
    <div className="cart-summary">
      <h1>Order summary</h1>
      <div className="items">
        <div>Items({itemCount})</div>
        <div>{"NOK" + " " + pricePreTax}</div>
      </div>
      <div className="tax">
        <div>{"Estimated tax (25%)"}</div>
        <div>{"NOK " + taxPrice}</div>
      </div>
      <hr className="cart-separator" />
      <div className="total">
        <div>{"Total"}</div>
        <div>{"Nok " + totalCost}</div>
      </div>
      {showCheckoutButton &&
        <div className="go-to-checkout-button">
          <button onClick={() => navigate("/checkout")}>
            Go to checkout
          </button>
        </div>
      }
    </div>

  )
}
