import { useState } from "react";
import { getCartTotalCost, getTicketCountInCart } from "../functions/CartHandler";
import CartSummary from "../components/CartSummary";
import styles from "../css/PaymentPage.module.css";
import { useLocation } from "react-router-dom";
import mailHandler from "../functions/MailHandler";

export default function PaymentPage() {

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const location = useLocation();
  const userEmail = location.state?.email;

  return (
    <div className={styles.page}>
      <div className={styles.disclaimer}>
        <h1>Disclaimer:</h1>
        <h3>This is not actually a functional payment portal. Do not use your actual payment information on this page.</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.description}>Brought to you by: TicketLords payment technology</div>
        <div className={styles.cardNumber}>
          <h3>Card Number</h3>
          <input
            type="number"
            placeholder="1234 5678 9012 3456"
            name="cardNumber"
            maxLength={16}
            id="card-number"
            autoComplete="off"
            value={cardNumber}
            onChange={e => {
              const newValue = e.target.value.slice(0, 16);
              setCardNumber(newValue);
            }}
          ></input>
        </div>

        <div className={styles.middle}>
          <div className={styles.expiry}>
            <h3>Expiration Date</h3>
            <input
              placeholder="MM/YY"
              name="expiryDate"
              id="expiry-date"
              autoComplete="off"
              value={expiryDate}
              onChange={(e) => {
                setExpiryDate(e.target.value);
              }}></input>
          </div>
          <div className={styles.cvv}>
            <h3>CVC / CVV</h3>
            <input
              placeholder="3 digits"
              name="cvc"
              autoComplete="off"
              value={cvc}
              inputMode="numeric"
              onChange={(e) => {
                setCvc(e.target.value.slice(0, 4));
              }
              }
            ></input>
          </div>
        </div>
        <div className={styles.cardholderName}>
          <h3>Cardholder Name</h3>
          <input
            placeholder="Ola Normann"
            name="cardholderName"
            autoComplete="off"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value);
            }}></input>

        </div>
        <button className={styles.payButton}
          onClick={() => mailHandler(userEmail)}
        >{"Pay " + getCartTotalCost() + " NOK"}</button>
      </div>
    </div >
  )
}
