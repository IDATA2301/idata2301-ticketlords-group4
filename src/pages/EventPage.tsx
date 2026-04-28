import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "../css/EventPage.css"
import {EVENTS} from "../data/events";

const WISHLIST_STORAGE_KEY = "wishlist-event-slugs";

function formatEventDate(isoDate: string): string {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) return isoDate;

    return parsed.toLocaleDateString("nb-NO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function getWishlistSlugs(): string[] {
    try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function setWishlistSlugs(slugs: string[]) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
}

export default function EventPage() {
    const {slug} = useParams<{ slug: string }>();
    const [isWishlisted, setIsWishlisted] = useState(false);

    const event = slug ? EVENTS[slug] : undefined;

    useEffect(() => {
        if (!slug) return;
        const slugs = getWishlistSlugs()
        setIsWishlisted(slugs.includes(slug));
    }, [slug]);

    const toggleWishlist = () => {
        if (!slug) return;

        const slugs = getWishlistSlugs()
        const next = slugs.includes(slug)
            ? slugs.filter((item) => item !== slug)
            : [...slugs, slug];

        setWishlistSlugs(next);
        setIsWishlisted(next.includes(slug));
    };

    if (!slug) {
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
                <p>We couldn't find an event for "{slug}".</p>
            </div>
        );
    }

    return (
        <div className="event-page">
            <div className="event-card">
                <div className="event-hero">
                        <div className="event-image-wrap">
                            {event.image ? (
                            <img
                                className="event-hero-image"
                                src={event.image}
                                alt={event.title}
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
                <h1 className="event-title">{event.title}</h1>

                <div className="event-meta">
                    <span className="event-location">{event.location}</span>
                    <span className="event-date">{formatEventDate(event.date)}</span>
                </div>

                <p className="event-description">{event.description}</p>
            </div>
        </div>
</div>
)
    ;

}