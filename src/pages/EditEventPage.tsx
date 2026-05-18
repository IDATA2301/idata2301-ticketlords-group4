import { useEffect, useState } from "react";
import styles from "../css/EditEventPage.module.css";
import { API_BASE_URL } from "../config";
import { isAuthenticated } from "../util/authUtils";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

type CategoryOption = { value: number; label: string };
type VenueOption   = { value: number; label: string };
type EventVenue    = { venueId: number; arena: string; country: string; city: string; address: string };

interface EventForm {
  eventName: string;
  host: string;
  eventDescription: string;
  eventDateStart: string;
  eventDateEnd: string;
  imgPathUrl: string;
}

export default function EditEventPage() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<EventForm>({
    eventName: "",
    host: "",
    eventDescription: "",
    eventDateStart: "",
    eventDateEnd: "",
    imgPathUrl: "",
  });

  // ── Category ──────────────────────────────────────────────────────────
  const [categories, setCategories]             = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [eventCategoryId, setEventCategoryId] = useState<number | null>(null);
  const [eventCategoryName, setEventCategoryName] = useState<string | null>(null);

  // ── Venue ─────────────────────────────────────────────────────────────
  const [venues, setVenues]               = useState<VenueOption[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [address, setAddress]             = useState("");
  const [arena, setArena]                 = useState("");
  const [city, setCity]                   = useState("");
  const [country, setCountry]             = useState("");

  // ── Load categories + existing event ─────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (!eventId) return;

    const token = localStorage.getItem("authToken");

    // Fetch categories and event in parallel
    Promise.all([
      fetch(`${API_BASE_URL}/categories/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/events/event/${encodeURIComponent(eventId)}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }).then((r) => r.json()),
    ])
      .then(([cats, data]) => {
        // Categories
        const catOpts: CategoryOption[] = cats.map(
          (c: { categoryId: number; categoryName: string }) => ({
            value: c.categoryId,
            label: c.categoryName,
          })
        );
        setCategories(catOpts);

        // Event fields
        setEvent({
          eventName:        data.eventName        || "",
          host:             data.host             || "",
          eventDescription: data.eventDescription || "",
          eventDateStart:   data.eventDateStart   ? data.eventDateStart.slice(0, 16) : "",
          eventDateEnd:     data.eventDateEnd     ? data.eventDateEnd.slice(0, 16)   : "",
          imgPathUrl:       data.imgPathUrl       || "",
        });

        // Capture category details for later preselect (API may return nested shape)
        const rawCategoryId =
          data?.categoryId ??
          data?.category?.categoryId ??
          data?.category?.id;
        const rawCategoryName =
          data?.categoryName ??
          data?.category?.categoryName ??
          data?.category?.name;

        const parsedCategoryId = Number(rawCategoryId);
        setEventCategoryId(!Number.isNaN(parsedCategoryId) && parsedCategoryId > 0 ? parsedCategoryId : null);
        setEventCategoryName(typeof rawCategoryName === "string" && rawCategoryName.trim() ? rawCategoryName : null);

        // Pre-select venue (API may return nested eventVenue/venue object)
        const rawVenueId =
          data?.venueId ??
          data?.eventVenue?.venueId ??
          data?.venue?.venueId ??
          data?.eventVenueId;

        const parsedVenueId = Number(rawVenueId);

        const venueFromEvent = data?.eventVenue ?? data?.venue;
        if (venueFromEvent && venueFromEvent.venueId) {
          const opt: VenueOption = {
            value: Number(venueFromEvent.venueId),
            label: `${venueFromEvent.arena} — ${venueFromEvent.address}, ${venueFromEvent.city}`,
          };
          setSelectedVenue(opt);
          setVenues([opt]);
        } else if (!Number.isNaN(parsedVenueId) && parsedVenueId > 0) {
          fetch(`${API_BASE_URL}/venues/${parsedVenueId}`)
            .then((r) => r.json())
            .then((v: EventVenue) => {
              const opt: VenueOption = {
                value: v.venueId,
                label: `${v.arena} — ${v.address}, ${v.city}`,
              };
              setSelectedVenue(opt);
              setVenues([opt]);
            })
            .catch(() => {
              // Fallback if venue detail endpoint isn't available
              const fallback: VenueOption = { value: parsedVenueId, label: `Venue #${parsedVenueId}` };
              setSelectedVenue(fallback);
              setVenues([fallback]);
            });
        }
      })
      .catch((err) => console.error("Error loading page data:", err));
  }, [eventId]);

  // ── Preselect category once categories + event are loaded ─────────────
  useEffect(() => {
    if (categories.length === 0) return;

    const matchById = eventCategoryId != null
      ? categories.find((c) => c.value === eventCategoryId)
      : undefined;
    const matchByName = !matchById && eventCategoryName
      ? categories.find((c) => c.label === eventCategoryName)
      : undefined;

    const match = matchById ?? matchByName;
    if (match) setSelectedCategory(match);
  }, [categories, eventCategoryId, eventCategoryName]);

  // ── Venue search ──────────────────────────────────────────────────────
  const loadVenues = async () => {
    const params = new URLSearchParams();
    if (address.trim()) params.append("address", address.trim());
    if (arena.trim())   params.append("arena",   arena.trim());
    if (city.trim())    params.append("city",     city.trim());
    if (country.trim()) params.append("country",  country.trim());
    if (!params.toString()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/venues/search?${params}`);
      if (!res.ok) return;
      const data: EventVenue[] = await res.json();
      setVenues(
        data.map((v) => ({
          value: v.venueId,
          label: `${v.arena} — ${v.address}, ${v.city}`,
        }))
      );
    } catch (err) {
      console.error("Error fetching venues:", err);
    }
  };

  // ── Generic field change ──────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.currentTarget;
    setEvent((prev) => ({ ...prev, [id]: value }));
  };

  const goToEventPage = () => navigate(`/event/${eventId}`);

  // ── Save ──────────────────────────────────────────────────────────────
  const handleUpdateEvent = async (): Promise<boolean> => {
    if (!eventId) return false;
    try {
      const body = {
        eventName:        event.eventName,
        host:             event.host,
        categoryId:       selectedCategory?.value ?? null,
        venueId:          selectedVenue?.value     ?? null,
        eventDescription: event.eventDescription,
        eventDateStart:   event.eventDateStart ? event.eventDateStart + ":00" : null,
        eventDateEnd:     event.eventDateEnd   ? event.eventDateEnd   + ":00" : null,
        imgPathUrl:       event.imgPathUrl || null,
      };

      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${API_BASE_URL}/events/event/${encodeURIComponent(eventId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Failed to update event");
      return true;
    } catch {
      console.error("Error updating event");
      return false;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className={styles.editEventPage}>
      {/* Hero */}
      <div className={styles.eventHero}>
        <div className={styles.eventAvatar}>
          {event.eventName?.[0]?.toUpperCase() || "E"}
        </div>
        <h1 className={styles.eventHeroName}>{event.eventName || "Edit Event"}</h1>
        <p className={styles.eventHeroHost}>{event.host ? `Hosted by ${event.host}` : ""}</p>
      </div>

      <div className={styles.eventCard}>
        {/* ── Details ── */}
        <section className={styles.eventSection}>
          <h2 className={styles.eventSectionTitle}>Details</h2>

          <div className={styles.eventField}>
            <label htmlFor="eventName">Event Name</label>
            <input
              type="text" id="eventName" value={event.eventName}
              onChange={handleChange} placeholder="My Awesome Event"
            />
          </div>

          <div className={styles.eventField}>
            <label htmlFor="host">Host</label>
            <input
              type="text" id="host" value={event.host}
              onChange={handleChange} placeholder="Organiser or company name"
            />
          </div>

          <div className={styles.eventField}>
            <label>Category</label>
            <Select
              options={categories}
              value={selectedCategory}
              onChange={(opt) => setSelectedCategory(opt as CategoryOption | null)}
              placeholder="Select a category"
              isSearchable
              classNamePrefix="edit-event-select"
            />
          </div>
        </section>

        <div className={styles.eventDivider} />

        {/* ── Venue ── */}
        <section className={styles.eventSection}>
          <h2 className={styles.eventSectionTitle}>Venue</h2>

          <div className={styles.eventRow}>
            <div className={styles.eventField}>
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g Larsgårdsvegen" />
            </div>
            <div className={styles.eventField}>
              <label>Arena</label>
              <input type="text" value={arena} onChange={(e) => setArena(e.target.value)} placeholder="e.g Color Line Stadion" />
            </div>
          </div>

          <div className={styles.eventRow}>
            <div className={styles.eventField}>
              <label>City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g Ålesund" />
            </div>
            <div className={styles.eventField}>
              <label>Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g Norway" />
            </div>
          </div>

          <div className={styles.eventField}>
            <button type="button" className={styles.btnSearchVenues} onClick={loadVenues}>
              Search Venues
            </button>
          </div>

          {venues.length > 0 && (
            <div className={styles.eventField}>
              <label>Select Venue</label>
              <Select
                options={venues}
                value={selectedVenue}
                onChange={(opt) => setSelectedVenue(opt as VenueOption | null)}
                placeholder="Select a venue"
                isSearchable
                classNamePrefix="edit-event-select"
              />
            </div>
          )}
        </section>

        <div className={styles.eventDivider} />

        {/* ── Schedule ── */}
        <section className={styles.eventSection}>
          <h2 className={styles.eventSectionTitle}>Schedule</h2>

          <div className={styles.eventRow}>
            <div className={styles.eventField}>
              <label htmlFor="eventDateStart">Start Date & Time</label>
              <input type="datetime-local" id="eventDateStart" value={event.eventDateStart} onChange={handleChange} />
            </div>
            <div className={styles.eventField}>
              <label htmlFor="eventDateEnd">End Date & Time</label>
              <input type="datetime-local" id="eventDateEnd" value={event.eventDateEnd} onChange={handleChange} />
            </div>
          </div>
        </section>

        <div className={styles.eventDivider} />

        {/* ── About ── */}
        <section className={styles.eventSection}>
          <h2 className={styles.eventSectionTitle}>About</h2>

          <div className={styles.eventField}>
            <label htmlFor="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              value={event.eventDescription}
              onChange={handleChange}
              placeholder="Tell people what this event is about…"
              rows={4}
            />
          </div>

          <div className={styles.eventField}>
            <label htmlFor="imgPathUrl">Image URL</label>
            <input
              type="url" id="imgPathUrl" value={event.imgPathUrl}
              onChange={handleChange} placeholder="https://example.com/image.jpg"
            />
          </div>
        </section>

        {/* ── Actions ── */}
        <div className={styles.eventActions}>
          <button
            className={styles.btnSave}
            id="submitChanges"
            onClick={async () => {
              const success = await handleUpdateEvent();
              if (success) {
                alert("Event updated successfully!");
                navigate(`/event/${eventId}`);
              } else {
                alert("Failed to update event. Please try again.");
              }
            }}
          >
            Save Changes
          </button>
          <button className={styles.btnBack} id="back" onClick={goToEventPage}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
