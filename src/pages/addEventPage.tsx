import "../css/addEvent.css";
import {useRef} from "react";

export default function AddEventPage() {
  const eventNameRef = useRef<HTMLInputElement>(null);
  const hostRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const eventDateStartRef = useRef<HTMLInputElement>(null);
  const eventDateEndRef = useRef<HTMLInputElement>(null);
  const eventVenue = useRef<HTMLInputElement>(null);
  const eventDescription = useRef<HTMLInputElement>(null);
  const imgPathUrl = useRef<HTMLInputElement>(null);


    return (
    <div className="add-event-page">
      <input type="text" ref={eventNameRef} placeholder="Event name"/>

      <input type="text" ref={hostRef} placeholder="Host name"/>

      <input type="text" ref={categoryRef} placeholder="Category"/>

      <input type="date" ref={eventDateStartRef} placeholder="Start date"/>

      <input type="date" ref={eventDateEndRef} placeholder="End date" />

      <input type="text" ref={eventVenue} placeholder="Venue" />

      <input type="text" ref={eventDescription} placeholder="Description" />

      <input type="image" ref={imgPathUrl} />




    </div>


  )
}