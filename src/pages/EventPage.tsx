import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useIsAdminRole from "../functions/CheckAdminRole";
import { TrashCanIcon } from "../assets/TrashCanIcon.tsx";
import "../css/EventPage.css"
import type Event from "../util/dtos/Event"
import { addToCart } from "../functions/CartHandler";
import type CartItem from "../data/CartItem";
import type Ticket from "../util/dtos/Ticket";
import { API_BASE_URL } from "../config";
import { getUserIdFromToken, isAuthenticated } from "../util/authUtils";


export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const token = localStorage.getItem("authToken");
  const userId = getUserIdFromToken();
  const eventDateISO = String(event?.eventDateStart || "");
  const [datePart, timePartRaw] = eventDateISO.split("T");
  const timePart = timePartRaw?.slice(0, 5);
  const location = useLocation();
  const isAdmin = useIsAdminRole(location.pathname); // boolean | null
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState(false);
  const [deleteEventLoading, setDeleteEventLoading] = useState(false);
  const [deleteEventError, setDeleteEventError] = useState<string | null>(null);

  // --- Visibility toggle state ---
  const [isPubliclyVisible, setIsPubliclyVisible] = useState<boolean | null>(null);
  const [confirmVisibilityChange, setConfirmVisibilityChange] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilityError, setVisibilityError] = useState<string | null>(null);
  const [visibilitySuccess, setVisibilitySuccess] = useState(false);

  // --- Create Ticket form state ---
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
  const toggleDEscription = (ticketId: number) => {
    setExpandedDescriptions(prev => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };
  const [ticketForm, setTicketForm] = useState({
    ticketType: "",
    price: "",
    amountAvailable: "",
    ticketDescription: "",
  });

  // --- Reduce ticket amount state ---
  const [reduceInputs, setReduceInputs] = useState<Record<number, string>>({});
  const [reduceLoading, setReduceLoading] = useState<Record<number, boolean>>({});
  const [reduceError, setReduceError] = useState<Record<number, string>>({});
  const [reduceSuccess, setReduceSuccess] = useState<Record<number, boolean>>({});

  // --- Delete ticket state ---
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<Record<number, boolean>>({});

  /**
   * Checks if the event is publicly visible.
   * If not visible and user is not an admin, redirect to homepage.
   * This runs first to prevent information leakage.
   */
  useEffect(() => {
    if (!eventId || isAdmin === null) return; // Wait for admin status to be determined

    const checkEventVisibility = async () => {
      try {
        const options: RequestInit = {};
        if (token) {
          options.headers = { "Authorization": `Bearer ${token}` };
        }
        const response = await fetch(`${API_BASE_URL}/events/event/${encodeURIComponent(eventId)}/check-public-visibility`, options);
        
        if (!response.ok) {
          // Event not found
          navigate("/");
          return;
        }

        const isPublic = await response.json();
        
        // If event is not public and user is not an admin, redirect to homepage
        if (!isPublic && !isAdmin) {
          navigate("/");
        }
      } catch {
        // On error, redirect to homepage
        console.error("Could not check event visibility");
        navigate("/");
      }
    };

    checkEventVisibility();
  }, [eventId, isAdmin, navigate]);

  /**
   * Fetches the current public visibility state of the event for the admin toggle.
   */
  useEffect(() => {
    if (!eventId || isAdmin !== true) return;
    const fetchVisibility = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/events/event/${encodeURIComponent(eventId)}/check-public-visibility`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (response.ok) {
          setIsPubliclyVisible(await response.json());
        }
      } catch {
        console.error("Could not fetch event visibility");
      }
    };
    fetchVisibility();
  }, [eventId, isAdmin]);

  /**
   * Loads an event from the database based on the eventId in the url.
   */
  useEffect(() => {
    if (!eventId) return;
    const loadEvent = async () => {
      try {
        const options: RequestInit = {};
        if (token) {
          options.headers = { "Authorization": `Bearer ${token}` };
        }
        const response = await fetch(`${API_BASE_URL}/events/event/` + encodeURIComponent(eventId), options);
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
   * Calls PUT /events/event/{eventId}/publicVisible to toggle visibility.
   */
  const handleSetVisibility = async (newValue: boolean) => {
    setVisibilityLoading(true);
    setVisibilityError(null);
    setVisibilitySuccess(false);
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/event/${encodeURIComponent(eventId!)}/publicVisible`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(newValue),
        }
      );
      if (response.status === 204) {
        setIsPubliclyVisible(newValue);
        setVisibilitySuccess(true);
        setTimeout(() => setVisibilitySuccess(false), 3000);
      } else if (response.status === 404) {
        setVisibilityError("Event not found.");
      } else {
        setVisibilityError("Failed to update visibility.");
      }
    } catch {
      setVisibilityError("Network error. Please try again.");
    } finally {
      setVisibilityLoading(false);
      setConfirmVisibilityChange(false);
    }
  };

  const handleDeleteEvent = async () => {
    setDeleteEventLoading(true);
    setDeleteEventError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/events/event/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (response.status === 204) {
        navigate("/home");
      } else if (response.status === 404) {
        setDeleteEventError("Event not found.");
      } else {
        setDeleteEventError("Failed to delete event.");
      }
    } catch {
      setDeleteEventError("Network error. Please try again.");
    } finally {
      setDeleteEventLoading(false);
      setConfirmDeleteEvent(false);
    }
  };

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
        eventId: event!.eventId,
      };

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
        if (response.status === 409) {
          setCreateError("A ticket type with this name already exists for this event. Please use a different name.");
        } else {
          const text = await response.text();
          setCreateError(text || "Failed to create ticket. Please try again.");
        }
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

  /**
   * Calls PUT /tickets/ticket/reduceAmount to decrease available tickets for a given ticketId.
   */
  const handleReduceAmount = async (ticketId: number) => {
    const newAmount = parseInt(reduceInputs[ticketId] ?? "", 10);
    if (isNaN(newAmount) || newAmount < 0) {
      setReduceError(prev => ({ ...prev, [ticketId]: "Enter a valid number ≥ 0." }));
      return;
    }
    setReduceError(prev => ({ ...prev, [ticketId]: "" }));
    setReduceLoading(prev => ({ ...prev, [ticketId]: true }));
    setReduceSuccess(prev => ({ ...prev, [ticketId]: false }));
    try {
      const response = await fetch(
        `${API_BASE_URL}/tickets/ticket/reduceAmount?ticketId=${ticketId}&quantity=${newAmount}`,
        {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (response.status === 204) {
        const ticketsResponse = await fetch(`${API_BASE_URL}/tickets/by-event/` + encodeURIComponent(event!.eventId));
        if (ticketsResponse.ok) setTickets(await ticketsResponse.json());
        setReduceInputs(prev => ({ ...prev, [ticketId]: "" }));
        setReduceSuccess(prev => ({ ...prev, [ticketId]: true }));
      } else if (response.status === 409) {
        setReduceError(prev => ({ ...prev, [ticketId]: "Invalid amount for this ticket." }));
      } else if (response.status === 400) {
        setReduceError(prev => ({ ...prev, [ticketId]: "Invalid quantity." }));
      } else {
        setReduceError(prev => ({ ...prev, [ticketId]: "Request failed." }));
      }
    } catch {
      setReduceError(prev => ({ ...prev, [ticketId]: "Network error." }));
    } finally {
      setReduceLoading(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  /**
   * Calls DELETE /tickets/ticket/{ticketId} to remove a ticket.
   * Requires confirmation step before executing.
   */
  const handleDeleteTicket = async (ticketId: number) => {
    setDeleteLoading(prev => ({ ...prev, [ticketId]: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/ticket/${ticketId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
        credentials: "include",
      });
      if (response.status === 204) {
        setTickets(prev => prev.filter(t => (t.ticketId as number) !== ticketId));
      } else if (response.status === 404) {
        setReduceError(prev => ({ ...prev, [ticketId]: "Ticket not found." }));
      } else {
        setReduceError(prev => ({ ...prev, [ticketId]: "Failed to delete ticket." }));
      }
    } catch {
      setReduceError(prev => ({ ...prev, [ticketId]: "Network error." }));
    } finally {
      setDeleteLoading(prev => ({ ...prev, [ticketId]: false }));
      setConfirmDeleteId(null);
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
        <h1>No event specified</h1>
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
              <div className="event-hero-placeholder" aria-label="No image available">
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
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <img
                className="wishlist-heart-icon"
                src={isWishlisted ? "/heart-filled.png" : "/heart-empty.png"}
                alt=""
                />
            </button>
          </div>
        </div>

        <div className="event-content">
          <h1 className="event-title">{event.eventName}</h1>

          <div className="event-meta">
            <div className="event-location">{event.eventVenue.city}, {event.eventVenue.country}</div>
            <div className="event-page-arena">{event.eventVenue.arena}</div>
            <div className="event-date">{datePart}</div>
            <div className="event-time">{timePart}</div>
          </div>

          <p className="event-description">
            {event.eventDescription.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>

          {isAuthenticated() && isAdmin === true && (
          <div className="event-delete-admin">
            {!confirmDeleteEvent ? (
              <button
                className="event-delete-button"
                onClick={() => setConfirmDeleteEvent(true)}
              >
                <TrashCanIcon size={17} /> Delete Event
              </button>
            ) : (
              <div className="event-delete-confirm">
                <span className="event-delete-confirm-text">
                  Permanently delete this event and all its tickets?
                </span>
                <div className="event-delete-confirm-actions">
                  <button
                    className="event-delete-confirm-yes"
                    disabled={deleteEventLoading}
                    onClick={handleDeleteEvent}
                  >
                    {deleteEventLoading ? "…" : "Yes, delete"}
                  </button>
                  <button
                    className="event-delete-confirm-no"
                    onClick={() => setConfirmDeleteEvent(false)}
                    disabled={deleteEventLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {deleteEventError && (
              <div className="event-delete-error">{deleteEventError}</div>
            )}
          </div>
        )}
        </div>
      </div>

      <div className="ticket-section">

        {/* ── Admin: event visibility toggle ── */}
        {isAuthenticated() && isAdmin === true && isPubliclyVisible !== null && (
          <div className="event-visibility-admin">
            <span className="event-visibility-label">
              Event visibility:
              <span className={`event-visibility-badge ${isPubliclyVisible ? "visible" : "hidden"}`}>
                {isPubliclyVisible ? "Public" : "Hidden"}
              </span>
            </span>

            {!confirmVisibilityChange ? (
              <button
                className={`event-visibility-toggle ${isPubliclyVisible ? "is-visible" : "is-hidden"}`}
                onClick={() => setConfirmVisibilityChange(true)}
                disabled={visibilityLoading}
              >
                {isPubliclyVisible ? "Make Hidden" : "Make Public"}
              </button>
            ) : (
              <div className="event-visibility-confirm">
                <span className="event-visibility-confirm-text">
                  {isPubliclyVisible
                    ? "Hide this event from the public?"
                    : "Make this event publicly visible?"}
                </span>
                <div className="event-visibility-confirm-actions">
                  <button
                    className="event-visibility-confirm-yes"
                    disabled={visibilityLoading}
                    onClick={() => handleSetVisibility(!isPubliclyVisible)}
                  >
                    {visibilityLoading ? "…" : "Confirm"}
                  </button>
                  <button
                    className="event-visibility-confirm-no"
                    onClick={() => setConfirmVisibilityChange(false)}
                    disabled={visibilityLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {visibilityError && (
              <div className="event-visibility-error">{visibilityError}</div>
            )}
            {visibilitySuccess && (
              <div className="event-visibility-success">
                ✓ Visibility updated successfully!
              </div>
            )}
          </div>
        )}

        {createSuccess && (
          <div className="ticket-create-success">
            ✓ Ticket created successfully!
          </div>
        )}

        {tickets.map((ticket: Ticket) => {
          const tid = ticket.ticketId as number;
          return (
            <div className="ticket-row" key={tid ?? ticket.ticketType}>

              {/* ── Main ticket info ── */}
              <div className="ticket-column">
                <div className="ticket-left">
                  <div className="ticket-information">
                    <div className="ticket-type">{ticket?.ticketType}</div>
                    <div className="ticket-divider" />
                    <div className="ticket-amount">{"Tickets remaining: " + ticket?.amountAvailable}</div>
                  {ticket?.ticketDescription && (
                    <button
                      className="ticket-info-button"
                      onClick={() => toggleDEscription(tid)}
                      aria-label="Show ticket description"
                      >
                      {expandedDescriptions[tid] ? "X" : "i"}
                    </button>
                    )}
                  </div>
                  {ticket?.ticketDescription && expandedDescriptions[tid] && (
                    <div className="ticket-description">{ticket.ticketDescription}</div>
                  )}
                </div>
                <div className="ticket-right">
                  <div className="price-and-add-to-cart-button">
                    <div className="ticket-price">{ticket?.price + ",- NOK"}</div>
                    <button
                      className="add-to-cart-button"
                      onClick={() => addToCart({ ticket, amount: 1 } as CartItem)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Admin panel: only visible to admins ── */}
              {isAuthenticated() && isAdmin === true && (
                <div className="ticket-admin-panel">
                  <span className="ticket-admin-label">Set availability</span>
                  <div className="ticket-admin-controls">
                    <input
                      className="ticket-admin-input"
                      type="number"
                      min="0"
                      placeholder="New amount"
                      value={reduceInputs[tid] ?? ""}
                      onChange={e =>
                        setReduceInputs(prev => ({ ...prev, [tid]: e.target.value }))
                      }
                    />
                    <button
                      className="ticket-admin-button"
                      disabled={reduceLoading[tid]}
                      onClick={() => handleReduceAmount(tid)}
                    >
                      {reduceLoading[tid] ? "…" : "Apply"}
                    </button>
                  </div>
                  {reduceError[tid] && (
                    <div className="ticket-admin-error">{reduceError[tid]}</div>
                  )}
                  {reduceSuccess[tid] && !reduceError[tid] && (
                    <div className="ticket-admin-success">✓ Updated</div>
                  )}

                  <div className="ticket-admin-divider" />

                  {confirmDeleteId === tid ? (
                    <div className="ticket-delete-confirm">
                      <span className="ticket-delete-confirm-text">Are you sure?</span>
                      <div className="ticket-delete-confirm-actions">
                        <button
                          className="ticket-delete-confirm-yes"
                          disabled={deleteLoading[tid]}
                          onClick={() => handleDeleteTicket(tid)}
                        >
                          {deleteLoading[tid] ? "…" : "Yes, delete"}
                        </button>
                        <button
                          className="ticket-delete-confirm-no"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="ticket-delete-button"
                      onClick={() => setConfirmDeleteId(tid)}
                    >
                      <TrashCanIcon size={17}/>
                      Remove ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Only show the Create Ticket button/form to admins */}
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
