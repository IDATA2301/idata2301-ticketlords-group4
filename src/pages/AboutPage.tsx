import "../css/AboutPage.css";

export default function AboutPage() {

  return (
    <div className="about-page">
      <div className="about-content">
        <h1>About TicketLords</h1>
        <p>TicketLords is a ticket selling platform, designed to make your life easier when finding and buying tickets for events.<br />
          With TicketLords, you can navigate seamlessly through a wide range of events, from concerts and sports to theater and festivals.
          Our user-friendly interface allows you to search for events based on your preferences, ensuring you never miss out on the entertainment you love.<br />
        </p>

        <h3>Finding tickets</h3>
        <p>At TicketLords we want you to be able to find the tickets you are interrested in. For this purpose filters are available
          to sort through events, wheter you are searching manually, or if you're browsing through events based on categories.<br />
        </p>
        <ul>
          <li>All: You find all events available.</li>
          <li>Upcoming: You find the events which are happening in the near future.</li>
          <li>Alphabetical: You find all events sorted in alphabetical order. {"(A -> Z)"}</li>
          <li>Most popular: You find the events that everyone is talking about! The events are sorted by the amount of clicks it has amassed.</li>
        </ul>

        <h3>

        </h3>
      </div>

    </div>
  )
}
