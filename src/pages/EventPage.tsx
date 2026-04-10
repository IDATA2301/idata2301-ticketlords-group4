import { useParams} from "react-router-dom";
import "../css/EventPage.css"

const EVENTS: Record<
    string,
    {
    title: string;
    location: string;
    date: string;
    description: string;
    image?: string;
}> = {
    "el-hispanico-festivalo": {
        title: "El Hispanico Festivalo",
        location: "Bergen",
        date: "2025-06-12",
        description: "A vibrant celebration of Hispanic culture",
        image: "src/assets/hispanic-cultural.png",
    }
};

export default function EventPage() {
    const { slug } = useParams<{ slug: string }>();

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
            <h1>Event details</h1>
            {slug && <h2>{slug}</h2>}
        </div>
    )




}