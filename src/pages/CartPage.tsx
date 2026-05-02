import type Ticket from "../util/dtos/Ticket";
import monthConverter from "../functions/DateConverter";
import "../css/CartPage.css";
import { useState } from "react";
import { getCart, saveCart, removeFromCart, getCartCount, getCartTotalCost } from "../functions/CartHandler";

export default function CartPage() {
  const hardCodedCartItems = [
    {
      ticketId: 1,
      event: {
        eventId: 1,
        eventName: "Jhonnysons",
        host: "Jhonny",
        category: {
          categoryId: 1,
          categoryName: "Music"
        },
        eventDateStart: new Date("2025-08-01"),
        eventDateEnd: new Date("2025-08-02"),
        eventVenue: {
          venueId: 1,
          arena: "Madison Square Garden",
          city: "New York",
          country: "Nigeria",
          address: "123 Main St"
        },
        eventDescription: "A great music event",
        totalClicks: 100,
        imgPathUrl: "event1.jpg"
      },
      ticketType: "VIP",
      price: 2000,
      amountAvailable: 50,
      ticketDescription: "Access to VIP lounge and free drinks"
    },
    {
      ticketId: 2,
      event: {
        eventId: 1,
        eventName: "Skibidi",
        host: "Im blue dabadee",
        category: {
          categoryId: 1,
          categoryName: "Music"
        },
        eventDateStart: new Date("2025-09-03"),
        eventDateEnd: new Date("2025-09-04"),
        eventVenue: {
          venueId: 1,
          arena: "Madison Square Garden",
          city: "New York",
          country: "Nigeria",
          address: "123 Main St"
        },
        eventDescription: "Now listen up heres a story",
        totalClicks: 200,
        imgPathUrl: "Chillin.png"
      },
      ticketType: "Normal",
      price: 5000,
      amountAvailable: 3,
      ticketDescription: "About a little guy who lives in a blue world and all day and all night and everything he sees is just blue like him inside and outside"
    },
    {
      ticketId: 3,
      event: {
        eventId: 2,
        eventName: "Skibidi",
        host: "Im blue dabadee",
        category: {
          categoryId: 1,
          categoryName: "Music"
        },
        eventDateStart: new Date("2025-09-03"),
        eventDateEnd: new Date("2025-09-04"),
        eventVenue: {
          venueId: 1,
          arena: "Madison Square Garden",
          city: "New York",
          country: "Nigeria",
          address: "123 Main St"
        },
        eventDescription: "Now listen up heres a story",
        totalClicks: 200,
        imgPathUrl: "Chillin.png"
      },
      ticketType: "Normal",
      price: 451,
      amountAvailable: 3,
      ticketDescription: "About a little guy who lives in a blue world and all day and all night and everything he sees is just blue like him inside and outside"
    }
  ]


  const [cartItems, setCartItems] = useState<Ticket[]>(hardCodedCartItems);
  const totalPrice = cartItems.reduce((sum, ticket) =>
    sum + ticket.price, 0);
  const pricePreTax = totalPrice * 0.75;
  const taxPrice = totalPrice * 0.25;

  const TrashCanIcon = () => (
    <svg width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>
  );

  return (
    <>
      <h1>Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((ticket: Ticket) => (
            <div className={"ticket-item"} key={ticket.ticketId}>
              <div className="ticket-info">
                <div>
                  <div>{ticket.event.eventName}</div>
                  <div>
                    {
                      (() => {
                        const date = new Date(ticket.event.eventDateStart);
                        return date.getDate() + " " + monthConverter(date.getMonth()) + " " + date.getFullYear();
                      })()
                    }
                  </div>
                  <div>Price: {ticket.price} NOK</div>
                  <div>Quantity: {ticket.amountAvailable}</div>
                </div>
                <div>
                  <button className="trash-button"
                    onClick={() => {
                      setCartItems(cartItems.filter(item => item.ticketId !== ticket.ticketId));
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
            <div>Items({cartItems.length})</div>
            <div>{"NOK" + " " + pricePreTax}</div>
          </div>
          <div className="tax">
            <div>{"Estimated tax (25%)"}</div>
            <div>{"NOK " + taxPrice}</div>
          </div>
          <hr className="cart-separator" />
          <div className="total">
            <div>{"Total"}</div>
            <div>{"Nok " + totalPrice}</div>
          </div>
        </div>
      </div >
    </>
  )
}
