import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Slider.css";

import PopularEventsCarousel from "../components/PopularEventsCarousel.tsx"; // adjust path if needed
import type Event from "../util/dtos/Event";
import { API_BASE_URL } from "../config";

export default function HomePage() {
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);

  const fetchPopularEvents = async (): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/events/popular`);
    if (!response.ok) return [];
    return response.json();
  };

  useEffect(() => {
    fetchPopularEvents().then((events) => {
      setPopularEvents(events);
    });
  }, []);

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a ticket"
        />
        <button type="submit">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path
              d="M15.5758 14.1455C17.6156 11.413 17.3939 7.52649 14.9117 5.0443C12.1869 2.31945 7.76893 2.3191 5.04408 5.04395C2.31852 7.76951 2.31887 12.1874 5.04373 14.9123C7.52627 17.3948 11.4124 17.6162 14.1457 15.5757L19.2745 20.7045C19.5018 20.9318 19.8105 21.0282 20.1069 20.9936C20.3251 20.9689 20.5371 20.8721 20.7047 20.7045C21.0999 20.3093 21.0996 19.6693 20.7047 19.2744L15.5758 14.1455ZM13.4816 6.47447C15.4166 8.40952 15.417 11.5467 13.4819 13.4818C11.5462 15.4175 8.40895 15.4172 6.47389 13.4821C4.53884 11.5471 4.53849 8.40987 6.47424 6.47412C8.40929 4.53907 11.5465 4.53942 13.4816 6.47447Z"
              fill="currentColor"
            />
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

      <PopularEventsCarousel popularEvents={popularEvents} />

    </>
  );
}
