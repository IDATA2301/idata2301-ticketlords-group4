import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type Event from "../util/dtos/Event";
import "../css/PopularEventsCarousel.css"
import { API_BASE_URL } from "../config";
interface PopularEventsCarouselProps {
  popularEvents: Event[];
}

const IMAGE_BASE = "http://10.212.25.185:8080/events/";

export default function PopularEventsCarousel({ popularEvents }: PopularEventsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const events = popularEvents.slice(0, 9).filter(Boolean);
  const total = events.length;

  const goTo = (index: number) => {
    setActiveIndex((index + total) % total);
  };

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  //TODO Auto-advance


  return (
    <section className="carousel-wrapper">
      <h2 className="carousel-heading">Popular Events</h2>

      <div
        className="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {events.map((event, i) => (
            <Link
              key={event.eventId}
              to={`/event/${event.eventId}`}
              className="carousel-slide"
              tabIndex={i === activeIndex ? 0 : -1}
            >
              <img
                src={`${API_BASE_URL}/events/${event.eventId}/image`}
                alt={event.eventName ?? `Event ${i + 1}`}
                className="carousel-slide-img"
                draggable={false}
              />
              <div className="carousel-slide-overlay">
                {event.eventName && <p className="carousel-slide-name">{event.eventName}</p>}
                <span className="carousel-slide-cta">More info</span>
              </div>
            </Link>
          ))}
        </div>
        <button
          className="carousel-arrow carousel-arrow--left"
          onClick={prev}
          aria-label="Previus event"
        >
          <img
            src="/arrow-left.png"
            alt="Arrow left icon"
          />
        </button>

        <button
          className="carousel-arrow carousel-arrow--right"
          onClick={next}
          aria-label="Next event"
        >
          <img
            src="/arrow-right.png"
            alt="Arrow right icon"
          />
        </button>
        {/* Pause / play toggle — matching the Live Nation ⏸ button */}
      </div>
    </section>
  );
}

