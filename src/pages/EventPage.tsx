import {useParams} from "react-router-dom";
import "../css/EventPage.css"

type EventData = {
    title: string;
    location: string;
    date: string;
    description: string;
    image?: string;
};

const EVENTS: Record<string, EventData> = {
    "el-hispanico-festivalo": {
        title: "El Hispanico Festivalo",
        location: "Bergen",
        date: "2026-06-12",
        description: "A vibrant celebration of Hispanic culture",
        image: "/src/assets/hispanic-cultural.png",
    },
    "hawaii-sunset-concert": {
        title: "Hawaii Sunset Concert",
        location: "Fårnebu Arena",
        date: "2026-08-12",
        description: "Live music with the sunset",
        image: "/src/assets/beach-sunset.png",
    },

};

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
        <div className="event-page">
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
                    <span className="event-date">{event.date}</span>
                </div>

                <p className="event-description">{event.description}</p>
            </div>
        </div>
    );

}