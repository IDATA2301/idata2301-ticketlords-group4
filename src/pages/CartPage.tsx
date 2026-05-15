import monthConverter from "../functions/DateConverter";
import styles from "../css/CartPage.module.css";
import { TrashCanIcon } from "../assets/TrashCanIcon.tsx";
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
                  ><TrashCanIcon size={30} />
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
