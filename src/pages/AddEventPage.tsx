import "../css/AddEvent.css";
import type Category from "../util/dtos/Category.ts";
import {useEffect, useRef, useState} from "react";
import Select from "react-select";
import {API_BASE_URL} from "../config.ts";
import {useNavigate} from "react-router-dom";

type CategoryOption = { value: number; label: string };
type VenueOption = { value: number; label: string };
type EventVenue = { venueId: number; arena: string; country: string; city: string; address: string };

export default function AddEventPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [arena, setArena] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const eventNameRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLInputElement>(null);
  const eventDateStartRef = useRef<HTMLInputElement>(null);
  const eventDateEndRef = useRef<HTMLInputElement>(null);
  const eventDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const imgPathUrlRef = useRef<HTMLInputElement>(null);
  //Venue section
  const venueArenaRef = useRef<HTMLInputElement>(null);
  const venueAddressRef = useRef<HTMLInputElement>(null);
  const venueCityRef = useRef<HTMLInputElement>(null);
  const venueCountryRef = useRef<HTMLInputElement>(null);
  const [venueErrors, setVenueErrors] = useState<{ [key: string]: string }>({});
  const [venueSuccess, setVenueSuccess] = useState("");
  const [isVenueLoading, setIsVenueLoading] = useState(false);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/`);
        if (!response.ok) {
          console.error("Failed to fetch categories");
          return;
        }
        const data: Category[] = await response.json();
        const formatted: CategoryOption[] = data.map(cat => ({
          value: cat.categoryId,
          label: cat.categoryName
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  const loadVenues = async () => {
  try {
    const params = new URLSearchParams();
    if (address.trim()) params.append("address", address.trim());
    if (arena.trim())   params.append("arena",   arena.trim());
    if (city.trim())    params.append("city",     city.trim());
    if (country.trim()) params.append("country",  country.trim());

    if (!params.toString()) return;

    const response = await fetch(`${API_BASE_URL}/venues/search?${params}`);
    if (!response.ok) {
      console.error("Failed to fetch venues");
      return;
    }
    const data: EventVenue[] = await response.json();
    const formatted: VenueOption[] = data.map(venue => ({
      value: venue.venueId,
      label: `${venue.arena} — ${venue.address}, ${venue.city}`
    }));
    setVenues(formatted);
  } catch (error) {
    console.error("Error fetching venues:", error);
  }
};

const handleAddVenue = async () => {
  if (isVenueLoading) return;

  const errors: { [key: string]: string } = {};
  if (!venueArenaRef.current?.value)   errors.arena   = "Arena is required";
  if (!venueAddressRef.current?.value) errors.address = "Address is required";
  if (!venueCityRef.current?.value)    errors.city    = "City is required";
  if (!venueCountryRef.current?.value) errors.country = "Country is required";

  if (Object.keys(errors).length > 0) {
    setVenueErrors(errors);
    return;
  }

  setVenueErrors({});
  setVenueSuccess("");
  setIsVenueLoading(true);

  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/venues/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        arena:   venueArenaRef.current?.value   || "",
        address: venueAddressRef.current?.value || "",
        city:    venueCityRef.current?.value    || "",
        country: venueCountryRef.current?.value || "",
      }),
    });

    if (!response.ok) throw new Error("Failed to add venue");

    setVenueSuccess("Venue added! You can now search for it.");
    if (venueArenaRef.current)   venueArenaRef.current.value   = "";
    if (venueAddressRef.current) venueAddressRef.current.value = "";
    if (venueCityRef.current)    venueCityRef.current.value    = "";
    if (venueCountryRef.current) venueCountryRef.current.value = "";
  } catch (error) {
    console.error("Error adding venue:", error);
    setVenueErrors({ general: "Failed to add venue. Please try again." });
  } finally {
    setIsVenueLoading(false);
  }
};


  const handleSubmit = async () => {
    if (isLoading) return;

    const errors: { [key: string]: string } = {};

    if (!eventNameRef.current?.value) errors.name = "Event name is required";
    if (!hostRef.current?.value) errors.host = "Host name is required";
    if (!selectedCategory) errors.category = "Category is required";
    if (!eventDateStartRef.current?.value) errors.datestart = "Start date is required";
    if (!eventDateEndRef.current?.value) errors.dateend = "End date is required";
    if (
      eventDateStartRef.current?.value &&
      eventDateEndRef.current?.value &&
      new Date(eventDateEndRef.current.value) <= new Date(eventDateStartRef.current.value)
    ) {
      errors.dateend = "End date must be after start date";
    }
    if (!selectedVenue) errors.venue = "Venue is required";
    if (!eventDescriptionRef.current?.value) errors.description = "Description is required";

    const imageFile = imgPathUrlRef.current?.files?.[0];
    if (imageFile) {
      if (!["image/jpeg", "image/png"].includes(imageFile.type)) {
        errors.image = "Only JPEG and PNG images are allowed";
      } else if (imageFile.size > 5 * 1024 * 1024) {
        errors.image = "Image must be under 5MB"
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return
    }

    setFieldErrors({});
    setRegistrationError("");
    setIsLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);

        const imgResponse = await fetch(`${API_BASE_URL}/events/upload-image`, {
          method: "POST",
          body: formDataImage,
        });

        if (!imgResponse.ok) {
          throw new Error("Image upload failed");
        }
        imageUrl = await imgResponse.text();
      }

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/events/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventName: eventNameRef.current?.value || "",
          host: hostRef.current?.value || "",
          categoryId: selectedCategory!.value,
          eventDateStart: eventDateStartRef.current?.value || "",
          eventDateEnd: eventDateEndRef.current?.value || "",
          venueId: selectedVenue!.value,
          eventDescription: eventDescriptionRef.current?.value || "",
          imgPathUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const location = response.headers.get("Location");
      if (location) {
        const relativePath = location.startsWith("http")
          ? new URL(location).pathname
          : location;
        navigate(relativePath);
      } else {
        navigate("/home");
      }
      
    } catch (error) {
      console.error("Error creating event:", error);
      setRegistrationError("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="add-event-layout">
      <div className="add-event-card">
        <h2>Create Event</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>

          <div className="add-event-field">
            <label>Event Name</label>
            <input type="text" ref={eventNameRef} placeholder="e.g Spring festival"/>
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

          <div className="add-event-field">
            <label>Host</label>
            <input type="text" ref={hostRef} placeholder="Host of the event"/>
            {fieldErrors.host && <p className="field-error">{fieldErrors.host}</p>}
          </div>

          <div className="add-event-field">
            <label>Category</label>
            <Select options={categories}
                    onChange={option => setSelectedCategory(option as CategoryOption | null)}
                    placeholder="Select a category" isSearchable/>
            {fieldErrors.category && <p className="field-error">{fieldErrors.category}</p>}
          </div>

          <div className="add-event-row">
            <div className="add-event-field">
              <label>Start Date</label>
              <input type="datetime-local" ref={eventDateStartRef} placeholder="Start date"/>
              {fieldErrors.datestart && <p className="field-error">{fieldErrors.datestart}</p>}
            </div>
            <div className="add-event-field">
              <label>End Date</label>
              <input type="datetime-local" ref={eventDateEndRef} placeholder="End date"/>
              {fieldErrors.dateend && <p className="field-error">{fieldErrors.dateend}</p>}
            </div>
          </div>

          {/* Venue search */}
          <label className="add-event-field">Venue</label>
          <div className="add-event-row">
            <div className="add-event-field">
              <label>Address</label>
              <input type="text" placeholder="e.g Larsgårdsvegen" value={address} onChange={e => setAddress(e.target.value)}/>
            </div>
            <div className="add-event-field">
              <label>Arena</label>
              <input type="text" placeholder="e.g Color Line Stadion" value={arena} onChange={e => setArena(e.target.value)}/>
            </div>
          </div>
          <div className="add-event-row">
            <div className="add-event-field">
              <label>City</label>
              <input type="text" placeholder="e.g Ålesund" value={city} onChange={e => setCity(e.target.value)}/>
            </div>
            <div className="add-event-field">
              <label>Country</label>
              <input type="text" placeholder="e.g Norway" value={country} onChange={e => setCountry(e.target.value)}/>
              {fieldErrors.venue && <p className="field-error">{fieldErrors.venue}</p>}
            </div>
          </div>
          <div className="add-event-field">
            <button type="button" onClick={loadVenues}>Search venues</button>
          </div>
          <div className="add-event-field">
            {venues.length > 0 && (
              <Select options={venues}
                      onChange={option => setSelectedVenue(option as VenueOption | null)}
                      placeholder="Select a venue" isSearchable/>
            )}
          </div>

          <div className="add-event-field">
            <label>Description</label>
            <textarea ref={eventDescriptionRef} placeholder="What is happening at the event" />
            {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
          </div>

          <div className="add-event-field">
            <label>Event Image</label>
            <input type="file" ref={imgPathUrlRef} accept="image/jpeg, image/png"/>
            {fieldErrors.image && <p className="field-error">{fieldErrors.image}</p>}
          </div>

          {registrationError && <p className="add-event-general-error">{registrationError}</p>}
          <button type="submit" className="add-event-submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>

      <div className="add-venue-card">
        <h2>Add Venue</h2>
        <p style={{ fontSize: "13px", color: "#666", marginTop: 0, marginBottom: "20px" }}>
          Can't find your venue? Add it here, then search for it.
        </p>
        <div className="add-event-field">
          <label>Arena</label>
          <input type="text" ref={venueArenaRef} placeholder="e.g Color Line Stadion"/>
          {venueErrors.arena && <p className="field-error">{venueErrors.arena}</p>}
        </div>
        <div className="add-event-field">
          <label>Address</label>
          <input type="text" ref={venueAddressRef} placeholder="e.g Larsgårdsvegen 1"/>
          {venueErrors.address && <p className="field-error">{venueErrors.address}</p>}
        </div>
        <div className="add-event-field">
          <label>City</label>
          <input type="text" ref={venueCityRef} placeholder="e.g Ålesund"/>
          {venueErrors.city && <p className="field-error">{venueErrors.city}</p>}
        </div>
        <div className="add-event-field">
          <label>Country</label>
          <input type="text" ref={venueCountryRef} placeholder="e.g Norway"/>
          {venueErrors.country && <p className="field-error">{venueErrors.country}</p>}
        </div>
        {venueErrors.general && <p className="add-event-general-error">{venueErrors.general}</p>}
        {venueSuccess && <p className="add-venue-success">{venueSuccess}</p>}
        <button className="add-venue-submit" onClick={handleAddVenue} disabled={isVenueLoading}>
          {isVenueLoading ? "Adding..." : "Add Venue"}
        </button>
      </div>
    </div>
  );
}