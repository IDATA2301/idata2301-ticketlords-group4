
function App() {

  const slide = (direction: number) => {
    console.log("Slide direction:", direction);
  };

  return (
    <>

      <div className="topnav">
        <a className="active" href="#Home">Home</a>
        <button className="login-btn">Login</button>
      </div>

      <div className="section-headline">
        <li>
          <h1 className="headline-main">Find Your Next Event</h1>
          <h2 className="headline-sub">Search Event, Artist, Location</h2>
        </li>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Search for a ticket" />
      </div>
      <br />
      <div className="event-categories">
        <div>🌍Cultural</div>
        <div>🍜Food & Drinks</div>
        <div>🏋️Sports</div>
        <div>🎶Arts & Music</div>
        <div>✋😐🤚Cinema</div>
        <div>More</div>
      </div>

      <br /><br />


      <div className="slider">
        <button className="arrow-left" onClick={() => slide(-1)}>&#8592;</button>
        <div className="event-popular">
          <div>Jogeir Johhnyson and The Scripts</div>
          <div>The Drage vs The Liavågs</div>
          <div>The Drage vs The Liavågs</div>
          <div>The Drage vs The Liavågs</div>
          <div>The Drage vs The Liavågs</div>
          <div>Anjdreas and the fourth dimension</div>
          <div>Jogeir, Funnyjunk og Bakken: En historie om kjærlighet og konflikt</div>
        </div>
        <button className="arrow-right" onClick={() => slide(1)}>&#8594;</button>
      </div>


      <footer className="footer">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </footer>
    </>
  );
}

export default App
