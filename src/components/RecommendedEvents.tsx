import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type Event from "../util/dtos/Event";
import { API_BASE_URL } from "../config";
import "../css/RecommendedEvents.css";
import { getUserIdFromToken } from "../util/authUtils";

export default function RecommendedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = getUserIdFromToken();


  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        if (userId) {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/api/user/` + encodeURIComponent(userId) + `/recommended-events`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);
          } else {
            setEvents(data.recommendedEvents || [])
          }
        }
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  console.log(events);
  if (!loading && events.length === 0) return null;

  return (
    <section className="recommended-section">
      <div className="recommended-header">
        <span className="recommended-pill">For You</span>
        <h2 className="recommended-title">Recommended Events</h2>
      </div>

      {loading ? (
        <div className="recommended-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rec-card rec-card--skeleton" />
          ))}
        </div>
      ) : (
        <div className="recommended-grid">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="rec-card"
              onClick={() => navigate(`/event/${event.eventId}`)}
            >
              <div className="rec-card__img-wrap">
                <img
                  src={`${API_BASE_URL}/events/${event.eventId}/image`}
                  alt={"Image of " + event.eventName}
                  className="rec-card__img"
                />
                <span className="rec-card__category">{String(event.category.categoryName)}</span>
              </div>
              <div className="rec-card__body">
                <h3 className="rec-card__name">{event.eventName}</h3>
                <p className="rec-card__meta">
                  📅 {new Date(event.eventDateStart).toLocaleDateString("no-NO", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
                <p className="rec-card__meta">Location: {event.eventVenue.address}</p>
                <button className="rec-card__btn">Get Tickets</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
