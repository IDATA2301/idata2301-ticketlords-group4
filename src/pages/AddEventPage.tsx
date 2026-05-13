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
    if (!country || !city) return;
    try {
      const response = await fetch(`${API_BASE_URL}/venues/location?country=${country}&city=${city}`);
      if (!response.ok) {
        console.error("Failed to fetch venues");
        return;
      }
      const data: EventVenue[] = await response.json();
      const formatted: VenueOption[] = data.map(venue => ({
        value: venue.venueId,
        label: venue.arena
      }));
      setVenues(formatted);
    } catch (error) {
      console.error("Error fetching venues:", error);
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
      
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      setRegistrationError("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="add-event-page">
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
              <input type="date" ref={eventDateStartRef} placeholder="Start date"/>
              {fieldErrors.datestart && <p className="field-error">{fieldErrors.datestart}</p>}
            </div>
            <div className="add-event-field">
              <label>End Date</label>
              <input type="date" ref={eventDateEndRef} placeholder="End date"/>
              {fieldErrors.dateend && <p className="field-error">{fieldErrors.dateend}</p>}
            </div>
          </div>

          {/* Venue search */}
          <div className="add-event-field">
            <label>Venue</label>
            <input type="text" placeholder="e.g Noreg" value={country} onChange={e => setCountry(e.target.value)}/>
            <input type="text" placeholder="e.g Ålesund" value={city} onChange={e => setCity(e.target.value)}/>
            <button type="button" onClick={loadVenues}>Search venues</button>
            {venues.length > 0 && (
              <Select options={venues}
                      onChange={option => setSelectedVenue(option as VenueOption | null)}
                      placeholder="Select a venue" isSearchable/>
            )}
            {fieldErrors.venue && <p className="field-error">{fieldErrors.venue}</p>}
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
    </div>
  );
}