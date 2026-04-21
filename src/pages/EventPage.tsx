import {useParams} from "react-router-dom";
import "../css/EventPage.css"
import { EVENTS } from "../data/events";

function formatEventDate(isoDate: string): string {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return isoDate;

    return parsed.toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function EventPage() {
    const {slug} = useParams<{ slug: string }>();

    if (!slug) {
        return (
            <div className="event-page">
                <h1> No event specified</h1>
            </div>
        );
    }

    const event = EVENTS[slug];

    if (!event) {
        return (
            <div className="event-page">
                <h1>Event not found</h1>
                <p>We couldn't find an event for "{slug}".</p>
            </div>
        );
    }

    return (
        <div className="event-header">
            <div className="event-hero">
                {event.image && (
                    <img
                        className="event-hero-image"
                        src={event.image}
                        alt={event.title}
                    />
                )}
            </div>

            <div className="event-content">
                <h1 className="event-title">{event.title}</h1>

                <div className="event-meta">
                    <span className="event-location">{event.location}</span>
                    <span className="event-date">{formatEventDate(event.date)}</span>
                </div>

                <p className="event-description">{event.description}</p>
            </div>
        </div>
    );

}