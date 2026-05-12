import { useEffect, useState } from "react";
import "../css/UserPage.css"
import { API_BASE_URL } from "../config";
import { clearAuthToken, getUserIdFromToken, isAuthenticated } from "../util/authUtils";
import { useNavigate } from "react-router-dom";
import type Event from "../util/dtos/Event";
import { deleteWishlistFromDatabase } from "../functions/WishlistHandler";


export default function UserPage() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const [user, setUser] = useState({
    email: "",
    displayName: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [wishlist, setWishlist] = useState([]);
  const sessionToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }

    if (userId) {
      // Fetch user data from backend
      fetch(`${API_BASE_URL}/users/user/` + encodeURIComponent(userId))
        .then((response) => response.json())
        .then((data) => {
          setUser({
            email: data.email || "",
            displayName: data.displayName || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            password: "",
          });
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const getWishlist = async () => {
        try {
          console.log(userId);
          const wishlistData = await fetch(`${API_BASE_URL}/wishlists/user/` + encodeURIComponent(userId))
          if (wishlistData.ok) {
            const data = await wishlistData.json();
            setWishlist(data.map((item: any) => item.event));
          }
        } catch {
          console.log("Could not fetch wishlist");
        }
      }
      getWishlist();
      console.log(wishlist);
    }
  }, []);

  const logOut = () => clearAuthToken() && navigate("/login");

  const initials = (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    || user.displayName?.[0]
    || "User";

  return (
    <div className="user-page">
      <div className="user-hero">
        <div className="user-avatar">{initials}</div>
        <h1 className="user-hero__name">{user.displayName}</h1>
        <p className="user-hero__email">{user.email}</p>
        <div className="user-hero__actions">
          <button className="btn-edit" onClick={() => navigate("/edit-account")}>Edit Profile</button>
          <button className="btn-logout" onClick={logOut}>Log Out</button>
        </div>
      </div>
      <section className="user-card">
        <h2 className="user-section__title"> Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="user-empty">Nothing saved yet. <span onClick={() => navigate("/")} className="user-link">Browse events!</span></p>
        ) : (
          <div className="event-list">
            {wishlist.map((event: Event) => (
              <div key={event.eventId} className="event-row" onClick={() => navigate(`/event/${event.eventId}`)}>
                <img src={`${API_BASE_URL}/events/${event.eventId}/image`} alt={event.eventName} className="event-row__img" />
                <div className="event-row__info">
                  <span className="event-row__name">{event.eventName}</span>
                  <span className="event-row__meta"> {new Date(event.eventDateStart).toLocaleDateString("nn-NO", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="event-row__meta"> {event.eventVenue.address}</span>
                </div>
                <span className="event-row__badge event-row__badge--pink">
                  <button
                    onClick={() => {
                      if (userId && sessionToken) {
                        deleteWishlistFromDatabase(userId, event.eventId, sessionToken)
                      }
                    }
                    }>Trash
                  </button></span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
