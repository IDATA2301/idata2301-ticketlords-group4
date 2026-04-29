import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Slider.css";

import { scrollByOne, slide } from "../functions/sliderHelper";
import type Event from "../util/dtos/Event";

export default function HomePage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);

  const updateArrows = () => {
    const element = sliderRef.current;
    if (element) {
      //The div is not null
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const fetchPopularEvents = async (): Promise<Event[]> => {
    const response = await fetch("http://10.212.25.185:8080/events/popular");
    if (!response.ok) return [];
    return response.json();
  }

  useEffect(() => {
    fetchPopularEvents().then(events => {
      setPopularEvents(events);
    });
  })

  useEffect(() => {
    const element = sliderRef.current;
    if (!element) return;

    const handleScroll = () => updateArrows();
    element.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateArrows);

    // Call once to set initial state
    updateArrows();

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [sliderRef]);

  const handleScroll = (direction: "left" | "right") => {
    const container = sliderRef.current;
    if (window.innerWidth > 600) {
      slide(container, direction);
    } else {
      scrollByOne(container, direction);
    }
  };


  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/events/search?query=" + encodeURIComponent(query));
  };


  return (
    <>
      <div className="section-headline">
        <div>
          <h1 className="headline-main">Find Your Next Event</h1>
          <h2 className="headline-sub">Search Event, Artist, Location</h2>
        </div>
      </div>
      <form
        className="search-container"
        onSubmit={handleSearch}
      >
        <input type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a ticket"
        />
        <button type="submit">Search</button>
      </form>
      <div className="event-categories">
        <Link to="/events/category/arts-music" className="event-category-link">
          <div>🎶Arts & Music</div>
        </Link>
        <Link to="/events/category/cinema" className="event-category-link">
          <div>✋😐🤚Cinema</div>
        </Link>
        <Link to="/events/category/cultural" className="event-category-link">
          <div>🌍Cultural</div>
        </Link>
        <Link to="/events/category/food-drinks" className="event-category-link">
          <div>🍜Food & Drinks</div>
        </Link>
        <Link to="/events/category/sports" className="event-category-link">
          <div>🏋️Sports</div>
        </Link>
        <Link to="/categories" className="event-category-link">
          <div>More</div>
        </Link>
      </div>

      <div className="event-popular-section">
        <div className="event-popular">
          <div className="event-popular-section-description">
            <h2> {"Popular events"}</h2>
          </div>
          <div className="scroll-left">
            {canScrollLeft && (
              <button
                className="arrow-left-button"
                onClick={() => handleScroll("left")}
              >
                <img
                  src="/src/assets/arrow-left.png"
                  alt="Arrow left icon"
                />
              </button>
            )}
          </div>
          <div className="category-items" ref={sliderRef}>
            <Link to="/event/el-hispanico-festivalo">
              <div className="category-item">
                <img src="/src/assets/hispanic-cultural.png" />
              </div>
              <div className="category-item-description">
                {"Default description"}
              </div>
            </Link>

            <Link to="/event/hawaii-sunset-concert">
              <div className="category-item">
                <img src="/src/assets/beach-sunset.png" />
              </div>
              <div className="category-item-description">
                {"Default description"}
              </div>
            </Link>

            <Link to="/events/lord-of-the-rings-trilogy">
              <div className="category-item">
                <img
                  src="/src/assets/lord-of-the-rings-triology.png"
                  alt="lord of the rings triology poster"
                />
              </div>
              <div className="category-item-description">
                Lord of the Rings Trilogy
              </div>
            </Link>

            <Link to="/events/cosplay-convention">
              <div className="category-item">
                <img
                  src="/src/assets/cosplay-convention.png"
                  alt="cosplay convention image"
                />
              </div>
              <div className="category-item-description">
                Cosplay Convention
              </div>
            </Link>

            <Link to="/events/drage-vs-liavags">
              <div className="category-item">The Drage vs The Liavågs</div>
              <div className="category-item-description">
                {"Default description"}
              </div>
            </Link>

            <Link to="/events/jogeir-heart">
              <div className="category-item">
                <img src="/src/assets/jogeirHeart.jpg" alt="Jogeir Heart" />
              </div>
              <div className="category-item-description">
                {"Default description"}
              </div>
            </Link>

            <Link to="/events/jogeir-funnyjunk-bakken">
              <div className="category-item">
                Jogeir, Funnyjunk og Bakken: En historie om kjærlighet og
                konflikt
              </div>
              <div className="category-item-description">
                {"Default description"}
              </div>
            </Link>

            <Link to="/events/jogeir-finger">
              <div className="category-item">
                Jogeir: the kid named finger
              </div>
              <div className="category-item-description">
                {"Default description"}
              </div>
            </Link>
          </div>

          <div className="scroll-right">
            {canScrollRight && (
              <button
                className="arrow-right-button"
                onClick={() => handleScroll("right")}
              >
                <img
                  src="/src/assets/arrow-right.png"
                  alt="Arrow right icon"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      <br />
      <br />
    </>
  );
}
