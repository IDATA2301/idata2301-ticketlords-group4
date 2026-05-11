import "../css/addEvent.css";
import type Category from "../util/dtos/Category.ts";
import {useEffect, useRef, useState} from "react";
import Select from "react-select";
import {API_BASE_URL} from "../config.ts";
import {useNavigate} from "react-router-dom";

type CategoryOption = { value: number; label: string };

export default function AddEventPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const eventNameRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLInputElement>(null);
  const eventDateStartRef = useRef<HTMLInputElement>(null);
  const eventDateEndRef = useRef<HTMLInputElement>(null);
  const eventVenueRef = useRef<HTMLInputElement>(null);
  const eventDescriptionRef = useRef<HTMLInputElement>(null);
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
    if (!eventVenueRef.current?.value) errors.venue = "Venue is required";
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


    const formData = new FormData();
    formData.append("name", eventNameRef.current?.value || "");
    formData.append("host", hostRef.current?.value || "");
    formData.append("categoryId", String(selectedCategory!.value));
    formData.append("dateStart", eventDateStartRef.current?.value || "");
    formData.append("dateEnd", eventDateEndRef.current?.value || "");
    formData.append("venue", eventVenueRef.current?.value || "");
    formData.append("description", eventDescriptionRef.current?.value || "");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const token = localStorage.getItem("token");

    setIsLoading(true);
    fetch(`${API_BASE_URL}/events/event`, {
      method: "POST",
      body: formData,
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((response) => {
        console.log("1");
        if (!response.ok) {
          console.log("2");
          throw new Error(`Failed to create event: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setIsLoading(false);
        navigate("/events");
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        setRegistrationError("Failed to create event. Please try again.");
        setIsLoading(false);
      });
  };


  return (
    <div className="add-event-page">
      <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
        <input type="text" ref={eventNameRef} placeholder="Event name"/>
        {fieldErrors.name && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.name}</p>}

        <input type="text" ref={hostRef} placeholder="Host name"/>
        {fieldErrors.host && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.host}</p>}


        <Select options={categories}
                onChange={option => setSelectedCategory(option as CategoryOption | null)}
                placeholder="Select a category" isSearchable/>
        {fieldErrors.category && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.category}</p>}

        <input type="date" ref={eventDateStartRef} placeholder="Start date"/>
        {fieldErrors.datestart && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.datestart}</p>}

        <input type="date" ref={eventDateEndRef} placeholder="End date"/>
        {fieldErrors.dateend && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.dateend}</p>}


        <input type="text" ref={eventVenueRef} placeholder="Venue"/>
        {fieldErrors.venue && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.venue}</p>}


        <input type="text" ref={eventDescriptionRef} placeholder="Description"/>
        {fieldErrors.description && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.description}</p>}

        <input type="file" ref={imgPathUrlRef}/>
        {fieldErrors.image && <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.image}</p>}

        {registrationError && <p style={{color: "red", fontSize: "12px"}}>{registrationError}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}