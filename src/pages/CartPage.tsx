import monthConverter from "../functions/DateConverter";
import styles from "../css/CartPage.module.css";
import { useState, useEffect } from "react";
import { getCart, removeFromCart, getCartTotalCost } from "../functions/CartHandler";
import type CartItem from "../data/CartItem";
import { useNavigate } from "react-router-dom";
import CartSummary from "../components/CartSummary";
import { getUserIdFromToken, isAuthenticated } from "../util/authUtils";
import isValidEmail from "../functions/EmailRegex";
import type RegisteredUser from "../util/dtos/RegisteredUser";
import { API_BASE_URL } from "../config";

export default function CartPage() {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState(getCartTotalCost());
  const [pricePreTax, setPricePreTax] = useState(getCartTotalCost() * 0.75);
  const [taxPrice, setTaxPrice] = useState(getCartTotalCost() * 0.25);
  const [emailError, setEmailError] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);

  const TrashCanIcon = () => (
    <svg width="30" height="auto" fill="currentColor" className={styles["bi.bi-trash"]} viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>
  );

  const navigate = useNavigate();

  useEffect(() => {
    const cartItems: CartItem[] = getCart().items;
    setCartItems(cartItems);
  }, []);

  useEffect(() => {
    setPricePreTax(getCartTotalCost() * 0.75);
  }, [cartItems]);

  useEffect(() => {
    setTaxPrice(getCartTotalCost() * 0.25);
  }, [cartItems]);

  useEffect(() => {
    setTotalCost(getCartTotalCost());
  }, [cartItems])

  useEffect(() => {
    const fetchUser = async () => {
      const userId = getUserIdFromToken();

      if (userId) {
        try {
          const registeredUserData = await fetch(`${API_BASE_URL}/users/user/` + encodeURIComponent(userId));
          if (registeredUserData.ok) {
            const registeredUser: RegisteredUser = await registeredUserData.json();
            setEmail(registeredUser.email);
          }
        } catch {
          console.error("Failed to fetch user data");
        }
      }
    }
    fetchUser();
  }, []);


  return (
    <>
      <h1 className={styles["header"]}>Cart</h1>
      <div className={styles["cart-content"]}>
        <div className={styles["cart-items"]}>
          {cartItems.map((cartItem: CartItem) => (
            <div className={styles["ticket-item"]} key={cartItem.ticket.ticketId}>
              <img
                src={`${API_BASE_URL}/events/${cartItem.ticket.event.eventId}/image`}
                alt={cartItem.ticket.event.eventName}
                className={styles["ticket-img"]}
              />
              <div className={styles["ticket-info"]}>
                <div>
                  <div>{cartItem.ticket.event.eventName}</div>
                  <div>
                    {
                      (() => {
                        const date = new Date(cartItem.ticket.event.eventDateStart);
                        return date.getDate() + " " + monthConverter(date.getMonth()) + " " + date.getFullYear();
                      })()
                    }
                  </div>
                  <div>Price: {cartItem.ticket.price} NOK</div>
                  <div>Quantity: {cartItem.amount}</div>
                </div>
                <div>
                  <button className={styles["trash-button"]}
                    onClick={() => {
                      removeFromCart(cartItem.ticket.ticketId);
                      setCartItems(getCart().items);
                    }}
                  ><TrashCanIcon />
                  </button>
                </div>
              </div>
            </div>
          )
          )}
        </div>

        <div className={styles["right-side"]}>
          <div className={styles["cart-summary"]}>
            <CartSummary
              totalCost={totalCost}
              pricePreTax={pricePreTax}
              taxPrice={taxPrice}
              itemCount={cartItems.reduce((sum, item) => sum + item.amount, 0)} />
          </div>

          {/* Show if the user is not logged in*/}
          {!isAuthenticated() &&
            <div className={styles["not-logged-in-prompt"]}>
              <div className={styles["guest-prompt"]}>
                <h2>Stay as guest</h2>
                <h3>E-mail address</h3>
                <input className={styles["user-email"] + " " + (emailError ? styles["user-email-error"] : "")}
                  type="email"
                  placeholder="email@example.com"
                  name="email"
                  id="user-email"
                  autoComplete="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                />
                <p>The tickets will be sent to your email address</p>

                {/* Shows if the user doesnt input email correctly*/}
                {!validEmail &&
                  <div className={styles["invalid-email-message"]}>
                    The email address must be valid and contain "@" and "." characters.
                  </div>
                }
              </div>

              <div className={styles["prompt-login"]}>
                <h3>Already have an account?</h3>
                <div>
                  <button className={styles["login-button"]} onClick={() => navigate("/login")}>Login</button>
                  <button className={styles["register-button"]} onClick={() => navigate("/register")}
                  > Create account</button>
                </div>
              </div>
            </div>
          }

          <div className={styles["place-order"]}>
            <button onClick={() => {
              if (!isAuthenticated()) {
                if (!email) {
                  setEmailError(true);
                  return;
                }
                if (!isValidEmail(email)) {
                  setValidEmail(false);
                  return;
                }
              }
              navigate("/checkout", { state: { email, cartItems } });
            }}> Place order →
            </button>
          </div>
        </div>
      </div >
    </>
  )
}
