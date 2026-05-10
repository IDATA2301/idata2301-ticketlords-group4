import "../css/addEvent.css";
import type Category from "../util/dtos/Category.ts";
import {useEffect, useRef, useState} from "react";
import Select from "react-select";
import {API_BASE_URL} from "../config.ts";

type CategoryOption = { value: number; label: string };

export default function AddEventPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const eventNameRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLInputElement>(null);
  const eventDateStartRef = useRef<HTMLInputElement>(null);
  const eventDateEndRef = useRef<HTMLInputElement>(null);
  const eventVenue = useRef<HTMLInputElement>(null);
  const eventDescription = useRef<HTMLInputElement>(null);
  const imgPathUrl = useRef<HTMLInputElement>(null);


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

    return (
    <div className="add-event-page">
      <input type="text" ref={eventNameRef} placeholder="Event name"/>

      <input type="text" ref={hostRef} placeholder="Host name"/>

      <Select options={categories}
              onChange={option => setSelectedCategory(option as CategoryOption | null)}
              placeholder="Select a category" isSearchable/>

      <input type="date" ref={eventDateStartRef} placeholder="Start date"/>

      <input type="date" ref={eventDateEndRef} placeholder="End date" />

      <input type="text" ref={eventVenue} placeholder="Venue" />

      <input type="text" ref={eventDescription} placeholder="Description" />

      <input type="file" ref={imgPathUrl} />




    </div>


  )
}