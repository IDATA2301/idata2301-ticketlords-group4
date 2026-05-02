import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/EventPage.css"
import type Event from "../util/dtos/Event"
import { addToCart } from "../functions/CartHandler";
import type CartItem from "../data/CartItem";
import type Ticket from "../util/dtos/Ticket";


export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const toggleWishlist = () => setIsWishlisted(prev => !prev);
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);



  /**
   * Loads an event from the database based on the eventId in the url.
   */
  useEffect(() => {
    if (!eventId) return;
    const loadEvent = async () => {
      try {
        const response = await fetch("http://10.212.25.185:8080/events/event/" + encodeURIComponent(eventId));
        if (!response.ok) {
          setEvent(fallBackEvent);
          return;
        }
        const data = (await response.json()) as Event;
        setEvent(data);
      } catch {
        setEvent(fallBackEvent);
      }
    };
    loadEvent();
  }, [eventId]);

  /**
   * Loads the types of tickets which is available for the event represented on this page.
   * Example: Event Grilling has 2 events, "Normal" and "VIP", this function will find both those ticket types, and their information.
   */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        if (event !== null) {
          const response = await fetch("http://10.212.25.185:8080/tickets/by-event/" + encodeURIComponent(event.eventId))
          if (response.ok) {
            setTickets(await response.json());
          }
        }
      } catch {
        setTickets([]);
      }
    }
    loadTickets();
  }, [event]);


  const fallBackEvent: Event = {
    "eventName": "The Jhonnysons",
    "eventId": 1,
    "host": "Jhonny himself",
    "imgPathUrl": "cosplay-convention.png",
    "category": {
      "categoryName": "Drama",
      "categoryId": 2,

    },
    "eventDescription": "He is vibing and celebrating just being a Jhonny",
    "totalClicks": 99999999999999,
    "eventDateEnd": new Date("2026-04-22"),
    "eventDateStart": new Date("2026-04-22"),
    "eventVenue": {
      "arena": "Jhonnys house",
      "city": "Ålesund",
      "country": "Norway",
      "address": "Nørvegjerdet 2C",
      "venueId": 1
    }
  };

  const fallBackTicket: Ticket = {
    "ticketId": 8,
    "event": fallBackEvent,
    "ticketType": "VIP",
    "price": 500,
    "amountAvailable": 16,
    "ticketDescription": "Get backstage access to The Jhonnysons"
  };


  if (!eventId) {
    return (
      <div className="event-page">
        <h1> No event specified</h1>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-page">
        <h1>Event not found</h1>
        <p>We couldn't find an event for "{eventId}".</p>
      </div>
    );
  }


  return (
    <div className="event-page">
      <div className="event-card">
        <div className="event-hero">
          <div className="event-image-wrap">
            {event?.imgPathUrl ? (
              <img
                className="event-hero-image"
                src={"http://10.212.25.185:8080/events/" + event.eventId + "/image"}
                alt={event.eventName}
              />
            ) : (
              <div className="event-hero-placeholder" aria-label="No image avialable">
                No image available
              </div>
            )}

            <button
              type="button"
              className={`wishlist-heart ${isWishlisted ? "is-active" : ""}`}
              onClick={toggleWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>
        </div>

        <div className="event-content">
          <h1 className="event-title">{event.eventName}</h1>

          <div className="event-meta">
            <div className="event-location"> {event.eventVenue.city}, {event.eventVenue.country} </div>
            <div className="event-page-arena">{event.eventVenue.arena}</div>
            <div className="event-date">{new Date(event.eventDateStart).toLocaleDateString()}</div>
          </div>

          <p className="event-description">{event.eventDescription}</p>
        </div>
      </div>

      <div className="ticket-section">

        {tickets.map((ticket: Ticket) => {
          return (
            <div className="ticket-column">
              <div className="ticket-price"> {ticket?.price}</div>
              <div className="ticket-amount"> {ticket?.amountAvailable}</div>
              <div className="ticket-type"> {ticket?.ticketType}</div>
              <button className="add-to-cart-button" onClick={() => addToCart({ ticket, amount: 1 } as CartItem)}>Add to cart</button>
            </div>
          )
        }
        )}
      </div>
    </div>
  );
}
