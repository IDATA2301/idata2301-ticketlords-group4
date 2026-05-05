import { useState } from "react";
import type CartItem from "../data/CartItem";
import { getCartTotalCost } from "../functions/CartHandler";
import { useNavigate } from "react-router-dom";
import styles from "../css/CartSummary.module.css"

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
    <div className={styles.cartSummary}>
      <h1>Order summary</h1>
      <div className={styles.items}>
        <div>Items({itemCount})</div>
        <div>{"NOK" + " " + pricePreTax}</div>
      </div>
      <div className={styles.tax}>
        <div>{"Estimated tax (25%)"}</div>
        <div>{"NOK " + taxPrice}</div>
      </div>
      <hr className={styles.cartSeparator} />
      <div className={styles.total}>
        <div>{"Total"}</div>
        <div>{"Nok " + totalCost}</div>
      </div>
      {showCheckoutButton &&
        <div className={styles.goToCheckoutButton}>
          <button onClick={() => navigate("/checkout")}>
            Go to checkout
          </button>
        </div>
      }
    </div>

  )
}
