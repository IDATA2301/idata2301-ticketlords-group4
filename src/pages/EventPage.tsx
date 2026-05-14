import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useIsAdminRole from "../functions/CheckAdminRole";
import "../css/EventPage.css"
import type Event from "../util/dtos/Event"
import { addToCart } from "../functions/CartHandler";
import type CartItem from "../data/CartItem";
import type Ticket from "../util/dtos/Ticket";
import { API_BASE_URL } from "../config";
import { getUserIdFromToken, isAuthenticated } from "../util/authUtils";


export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const token = localStorage.getItem("authToken");
  const userId = getUserIdFromToken();
  const eventDateISO = String(event?.eventDateStart || "");
  const [datePart, timePartRaw] = eventDateISO.split("T");
  const timePart = timePartRaw?.slice(0, 5);const location = useLocation();
  const isAdmin = useIsAdminRole(location.pathname); // boolean | null

  // Create Ticket form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    ticketType: "",
    price: "",
    amountAvailable: "",
    ticketDescription: "",
  });

  /**
   * Loads an event from the database based on the eventId in the url.
   */
  useEffect(() => {
    if (!eventId) return;
    const loadEvent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events/event/` + encodeURIComponent(eventId));
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
   * Checks the backend if the event/user combination is wishlisted,
   * and sets the isWishlisted state accordingly.
   */
  useEffect(() => {
    const setWishlistStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/wishlists/is-wishlisted/${userId}/${eventId}`);
        if (response.ok) {
          const wishlistStatus = await response.json();
          setIsWishlisted(wishlistStatus);
        }
      } catch {
        console.error("Could not fetch wishlist status");
      }
    };
    setWishlistStatus();
  }, [userId, eventId]);

  /**
   * Loads the types of tickets which is available for the event represented on this page.
   * Example: Event Grilling has 2 events, "Normal" and "VIP", this function will find both those ticket types, and their information.
   */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        if (event !== null) {
          const response = await fetch(`${API_BASE_URL}/tickets/by-event/` + encodeURIComponent(event.eventId))
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

  /**
   * Saves the wishlist to the database, by sending a POST request to the backend with the userId and eventId.
   */
  const saveWishlistToDatabase = async (userId: number, eventId: number) => {
    fetch(`${API_BASE_URL}/wishlists/user/${userId}/event/${eventId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    });
  }

  /**
   * Deletes the wishlist from the database, by sending a DELETE request to the backend with the userId and eventId.
   */
  const deleteWishlistFromDatabase = async (userId: number, eventId: number) => {
    fetch(`${API_BASE_URL}/wishlists/user/${userId}/event/${eventId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    });
  }

  /**
   * Handles input changes for the create-ticket form.
   */
  const handleTicketFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTicketForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Submits the new ticket to the backend via POST /tickets/ticket.
   * The backend expects the ticket fields + `eventId`.
   */
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);

    if (!ticketForm.ticketType.trim()) {
      setCreateError("Ticket type is required.");
      return;
    }
    const priceNum = parseFloat(ticketForm.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setCreateError("Please enter a valid price.");
      return;
    }
    const amountNum = parseInt(ticketForm.amountAvailable, 10);
    if (isNaN(amountNum) || amountNum < 1) {
      setCreateError("Amount available must be at least 1.");
      return;
    }

    setCreateLoading(true);
    try {
      const body = {
        ticketType: ticketForm.ticketType.trim(),
        price: priceNum,
        amountAvailable: amountNum,
        ticketDescription: ticketForm.ticketDescription.trim() || null,
        eventId: event!.eventId ,
      };

      
      console.log(body);

      const response = await fetch(`${API_BASE_URL}/tickets/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        setCreateError(text || "Failed to create ticket. Please try again.");
        return;
      }

      // Refresh ticket list after successful creation
      const ticketsResponse = await fetch(`${API_BASE_URL}/tickets/by-event/` + encodeURIComponent(event!.eventId));
      if (ticketsResponse.ok) {
        setTickets(await ticketsResponse.json());
      }

      setCreateSuccess(true);
      setTicketForm({ ticketType: "", price: "", amountAvailable: "", ticketDescription: "" });
      setShowCreateForm(false);
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

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
                src={
                  event.imgPathUrl.startsWith("images/")
                    ? `${API_BASE_URL}/events/${event.eventId}/image`
                    : `${API_BASE_URL}/images/` + event?.imgPathUrl
                }
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
              onClick={() => {
                if (isAuthenticated() && userId) {
                  setIsWishlisted(!isWishlisted);
                  if (!isWishlisted) {
                    saveWishlistToDatabase(userId, event.eventId);
                  } else {
                    deleteWishlistFromDatabase(userId, event.eventId);
                  }
                } else {
                  alert("You need to be logged in to use the wishlist feature.");
                }
              }
              }
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
            <div className="event-date">{datePart}</div>
            <div className="event-time">{timePart}</div>
          </div>

          <p className="event-description">{event.eventDescription}</p>
        </div>
      </div>

      <div className="ticket-section">

        {createSuccess && (
          <div className="ticket-create-success">
            ✓ Ticket created successfully!
          </div>
        )}

        {tickets.map((ticket: Ticket) => {
          return (
            <div className="ticket-row">
              <div className="ticket-column">
                <div className="ticket-information">
                  <div className="ticket-type"> {ticket?.ticketType + "  |"}</div>
                  <div className="ticket-amount"> {"Tickets remaining: " + ticket?.amountAvailable}</div>
                </div>
                <div className="price-and-add-to-cart-button">
                  <div className="ticket-price"> {ticket?.price + ",- NOK"}</div>
                  <button className="add-to-cart-button"
                    onClick={() => addToCart({ ticket, amount: 1 } as CartItem)}>Add to cart
                  </button>
                </div>
              </div>
              <button>jepps</button>
            </div>
          )
        })}

        {/* Only show the Create Ticket button/form if the user is authenticated */}
        {isAuthenticated() && isAdmin === true && (
          <div className="create-ticket-section">
            {!showCreateForm ? (
              <button
                className="create-ticket-toggle-button"
                onClick={() => { setShowCreateForm(true); setCreateSuccess(false); }}
              >
                + Add New Ticket Type
              </button>
            ) : (
              <div className="create-ticket-form-wrapper">
                <h3 className="create-ticket-form-title">Create New Ticket</h3>
                <form className="create-ticket-form" onSubmit={handleCreateTicket} noValidate>
                  <div className="create-ticket-field">
                    <label htmlFor="ticketType">Ticket Type <span className="required">*</span></label>
                    <input
                      id="ticketType"
                      name="ticketType"
                      type="text"
                      placeholder="e.g. Standard, VIP, Early Bird"
                      value={ticketForm.ticketType}
                      onChange={handleTicketFormChange}
                      required
                    />
                  </div>

                  <div className="create-ticket-row">
                    <div className="create-ticket-field">
                      <label htmlFor="price">Price (NOK) <span className="required">*</span></label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 299"
                        value={ticketForm.price}
                        onChange={handleTicketFormChange}
                        required
                      />
                    </div>

                    <div className="create-ticket-field">
                      <label htmlFor="amountAvailable">Amount Available <span className="required">*</span></label>
                      <input
                        id="amountAvailable"
                        name="amountAvailable"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 100"
                        value={ticketForm.amountAvailable}
                        onChange={handleTicketFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="create-ticket-field">
                    <label htmlFor="ticketDescription">Description</label>
                    <textarea
                      id="ticketDescription"
                      name="ticketDescription"
                      placeholder="Optional: describe what's included with this ticket"
                      value={ticketForm.ticketDescription}
                      onChange={handleTicketFormChange}
                      rows={3}
                    />
                  </div>

                  {createError && (
                    <div className="create-ticket-error">{createError}</div>
                  )}

                  <div className="create-ticket-actions">
                    <button
                      type="button"
                      className="create-ticket-cancel"
                      onClick={() => { setShowCreateForm(false); setCreateError(null); }}
                      disabled={createLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="create-ticket-submit"
                      disabled={createLoading}
                    >
                      {createLoading ? "Creating…" : "Create Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
