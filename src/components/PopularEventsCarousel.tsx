import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import type Event from "../util/dtos/Event.ts";
import "../css/PopularEventsCarousel.css"
import {API_BASE_URL} from "../config.ts";
import registerEventClick from "../functions/RegisterEventClick.ts";
import registerInterest from "../functions/RegisterInterest.ts";
import {getUserIdFromToken} from "../util/authUtils.ts";

/**
 * Props for {@link PopularEventsCarousel}.
 */
interface PopularEventsCarouselProps {
  popularEvents: Event[];
}

/**
 * A carousel component that displays up to 9 popular events as an auto-moving slideshow.
 * Pauses on mouse hover and supports manual navigation with arrows
 *
 *
 * @param popularEvents Array of events from popular. Up to 9
 * @returns A carousel section, or null if no events are provided.
 */
export default function PopularEventsCarousel({popularEvents}: PopularEventsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userId = getUserIdFromToken();
  const unregisteredId = localStorage.getItem("unregisteredUserId");
  const touchStartX = useRef<number | null>(null);
  const events = popularEvents.slice(0, 9).filter(Boolean);
  const total = events.length;

  /**
   * Navigates to a specific slide by index, wrapping around if the index
   * goes out of bounds in either direction.
   *
   * @param index The target slide index
   */
  const goTo = (index: number) => {
    setActiveIndex((index + total) % total);
  };

  /**
   * Navigates to the previous slide.
   */
  const prev = () => goTo(activeIndex - 1);

  /**
   * Navigates to the next slide.
   */
  const next = () => goTo(activeIndex + 1);

  /**
   * Records the horizontal position where the touch started.
   * Used together with {@link handleTouchEnd} to detect swipe direction.
   *
   * @param e - The touch event fired when the user touches the carousel.
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  /**
   * Compares the touch end position against the start position to determine
   * swipe direction. Navigates to the next or previous slide if the swipe
   * distance exceeds 40px, otherwise ignores it as an accidental touch.
   *
   * @param e - The touch event fired when the user lifts their finger.
   */
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
  };

// Starts a 5-second auto-advance interval, clearing it when paused or unmounted.
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, total]);

  if (!total) return null;

  return (
    <section className="carousel-wrapper">
      <h2 className="carousel-heading">Popular Events</h2>

      <div
        className="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-inner">
          <div className="carousel-track" style={{transform: `translateX(-${activeIndex * 100}%)`}}>
            {events.map((event, i) => (
              <Link
                key={event.eventId}
                to={`/event/${event.eventId}`}
                className="carousel-slide"
                tabIndex={i === activeIndex ? 0 : -1}
                onClick={() => {
                  if (unregisteredId) {
                    registerEventClick(event.eventId, parseInt(unregisteredId));
                  }
                  if (userId) {
                    registerInterest(event.category.categoryId, userId)
                  }
                }
                }

              >
                <img
                  src={
                    event.imgPathUrl.startsWith("images/")
                      ? `${API_BASE_URL}/events/${event.eventId}/image`
                      : `${API_BASE_URL}/images/` + event?.imgPathUrl
                  }
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

        <div className="carousel-dots">
          {events.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === activeIndex ? "carousel-dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}

          <button
            className="carousel-pause"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            )}
          </button>
        </div>

        <div className="carousel-shadow-overlay"/>

      </div>
    </section>
  );
}

