import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import type Event from "../util/dtos/Event"

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Event[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (query) {
      fetch("/events/search?query=" + encodeURIComponent(query))
        .then((response: Response) => response.ok ? response.json() : [])
        .then((data: Event[]) => {
          if (!data || data.length === 0) {
            setNotFound(true);
            setResults([]);
          } else {
            setResults(data);
            setNotFound(false);
          }
        }
        ).catch(() => {
          setNotFound(true);
          setResults([]);
        });
    }
  }, [query]);

  return (
    <>
      <div>
        <h2>Search Results for "{query}"</h2>
        {notFound ? <div>Woops! Seems no events could be found by this query. Maybe try something else?</div> :
          <ul>
            {results.map((event: Event) => (
              <li key={event.eventId}>
                {event.eventName}</li>
            ))}
          </ul>
        }
      </div>
    </>
  );
}
