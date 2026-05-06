import type Ticket from "../util/dtos/Ticket";
import monthConverter from "../functions/DateConverter";
import "../css/CartPage.css";
import { useState, useEffect } from "react";
import { getCart, removeFromCart, getCartCount, getCartTotalCost } from "../functions/CartHandler";
import type CartItem from "../data/CartItem";

export default function CartPage() {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState(getCartTotalCost());
  const [pricePreTax, setPricePreTax] = useState(getCartTotalCost() * 0.75);
  const [taxPrice, setTaxPrice] = useState(getCartTotalCost() * 0.25);

  const TrashCanIcon = () => (
    <svg width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>
  );

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

  return (
    <>
      <h1>Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((cartItem: CartItem) => (
            <div className={"ticket-item"} key={cartItem.ticket.ticketId}>
              <div className="ticket-info">
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
                  <button className="trash-button"
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
        <div className="cart-summary">
          <h1>Order summary</h1>
          <div className="items">
            <div>Items({cartItems.reduce((sum, item) => sum + item.amount, 0)})</div>
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
        </div>
      </div >
    </>
  )
}
