import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "../css/EventPage.css"
import type Event from "../util/dtos/Event"



export default function EventPage() {
    const {eventId} = useParams<{ eventId: string }>();
    const [isWishlisted, setIsWishlisted] = useState(false);

    const [event, setEvent] = useState<Event | null>(null);

useEffect(() => {
  if (!eventId) return;

  const load = async () => {
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

  load();
}, [eventId]);

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


   /** if (!eventId) {
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
    **/


    return (
        <div className="event-page">
            <div className="event-card">
                <div className="event-hero">
                        <div className="event-image-wrap">
                            {event?.imgPathUrl ? (
                            <img
                                className="event-hero-image"
                                src={"http://10.212.25.185:8080/events/" + event.eventId + "/image" }
                                alt={event.eventName}
                            />
                                ) : (
                                    <div className="event-hero-placeholder" aria-label="No image avialable">
                                        No image available
                                    </div>x
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
                    <span className="event-city">{event.eventVenue.city} </span>
                    <span className="event-country">{event.eventVenue.country} </span>
                    <span className="event-arena">{event.eventVenue.arena }</span>
                    <span className="event-date">{new Date(event.eventDateStart).toLocaleDateString()}</span>
                </div>

                <p className="event-description">{event.eventDescription}</p>
            </div>
        </div>
</div>
)
    ;

}