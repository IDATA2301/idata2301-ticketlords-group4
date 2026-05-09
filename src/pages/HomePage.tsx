import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Slider.css";
import { API_BASE_URL } from "../config";

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
    const response = await fetch(`${API_BASE_URL}/events/popular`);
    if (!response.ok) return [];
    return response.json();
  }

  useEffect(() => {
    fetchPopularEvents().then(events => {
      setPopularEvents(events);
    });
  }, []);

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
        <button type="submit">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M15.5758 14.1455C17.6156 11.413 17.3939 7.52649 14.9117 5.0443C12.1869 2.31945 7.76893 2.3191 5.04408 5.04395C2.31852 7.76951 2.31887 12.1874 5.04373 14.9123C7.52627 17.3948 11.4124 17.6162 14.1457 15.5757L19.2745 20.7045C19.5018 20.9318 19.8105 21.0282 20.1069 20.9936C20.3251 20.9689 20.5371 20.8721 20.7047 20.7045C21.0999 20.3093 21.0996 19.6693 20.7047 19.2744L15.5758 14.1455ZM13.4816 6.47447C15.4166 8.40952 15.417 11.5467 13.4819 13.4818C11.5462 15.4175 8.40895 15.4172 6.47389 13.4821C4.53884 11.5471 4.53849 8.40987 6.47424 6.47412C8.40929 4.53907 11.5465 4.53942 13.4816 6.47447Z" fill="currentColor"></path>
          </svg>
        </button>
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
          <div className="event-popular-section-name">
            <h2> {"Popular events"}</h2>
          </div>
          <div className="scroll-left">
            {canScrollLeft && (
              <button
                className="arrow-left-button"
                onClick={() => handleScroll("left")}
              >
                <img
                  src="/arrow-left.png"
                  alt="Arrow left icon"
                />
              </button>
            )}
          </div>
          <div className="category-items" ref={sliderRef}>
            <Link to={"/event/" + popularEvents[0]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[0]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[0]?.eventName}
              </div>
            </Link>

            <Link to={"/event/" + popularEvents[1]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[1]?.eventId + "/image"} />

              </div>
              <div className="category-item-name">
                {popularEvents[1]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[2]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[2]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[2]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[3]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[3]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[3]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[4]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[4]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[4]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[5]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[5]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[5]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[6]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[6]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[6]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[7]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[7]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[7]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[8]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[8]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[8]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[9]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[9]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[9]?.eventName}
              </div>
            </Link>

            <Link to={"/events/" + popularEvents[10]?.eventId}>
              <div className="category-item">
                <img src={"https://ticketlords-backend-app-ripdj.ondigitalocean.app/events/" + popularEvents[10]?.eventId + "/image"} />
              </div>
              <div className="category-item-name">
                {popularEvents[10]?.eventName}
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
                  src="/arrow-right.png"
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
