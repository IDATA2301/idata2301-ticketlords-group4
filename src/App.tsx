import React, { useRef, useState, useEffect } from "react";
import "./css/HamburgerMenu.css";
import "./css/Slider.css";
function App() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const element = sliderRef.current;
    if (element) {
      //The div is not null
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        element.scrollLeft + element.clientWidth < element.scrollWidth,
      );
    }
  };

  const HamburgerMenu: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          className={`hamburger${open ? " open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        {open && (
          <>
            <div className="sidebar">
              <div className="sidebar-top">
                <div className="sidebar-event-categories">
                  <div>🎶Arts & Music</div>
                  <div>✋😐🤚Cinema</div>
                  <div>🌍Cultural</div>
                  <div>🍜Food & Drinks</div>
                  <div>🏋️Sports</div>
                  <div>More</div>
                </div>
              </div>
            </div>

            {/*TODO: Render menu content after the hambuger menu is clicked here.*/}
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    const element = sliderRef.current;
    if (!element) return;

    const handleScroll = () => updateArrows();
    element.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateArrows);

    // Call once to set initial state
    updateArrows();

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [sliderRef]);

  const slide = (direction: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <div id="root">
        <div className="main-content">
          <div className="topnav">
            <div className="topnav-left">
              <div className="hamburger-menu">
                <header>
                  <HamburgerMenu />
                </header>
              </div>
            </div>
            <div className="topnav-middle">
              <a className="active" href="#Home">
                Home
              </a>
            </div>
            <div className="topnav-right">
              <button className="login-btn">Login</button>
            </div>
          </div>
          <div className="section-headline">
            <div>
              <h1 className="headline-main">Find Your Next Event</h1>
              <h2 className="headline-sub">Search Event, Artist, Location</h2>
            </div>
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

          <div className="event-popular-section">
            <div className="event-popular">
              <div className="scroll-left">
                {canScrollLeft && (
                  <button
                    className="arrow-left-button"
                    onClick={() => slide(-1)}
                  >
                    {"<"}
                  </button>
                )}
              </div>
              <div className="category-items" ref={sliderRef}>
                <div className="category-item">
                  Jogeir Johhnyson and The Scripts
                </div>
                <div className="category-item">The Drage vs The Liavågs</div>
                <div className="category-item">The Drage vs The Liavågs</div>
                <div className="category-item">The Drage vs The Liavågs</div>
                <div className="category-item">The Drage vs The Liavågs</div>
                <div className="category-item">
                  <img src="/src/assets/jogeirHeart.jpg"></img>
                </div>
                <div className="category-item">
                  Jogeir, Funnyjunk og Bakken: En historie om kjærlighet og
                  konflikt
                </div>
                <div className="category-item">
                  Jogeir: the kid named finger
                </div>
              </div>

              <div className="scroll-right">
                {canScrollRight && (
                  <button
                    className="arrow-right-button"
                    onClick={() => slide(1)}
                  >
                    {">"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <br />
          <br />
        </div>
        <footer className="footer">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </footer>
      </div>
    </>
  );
}

export default App;
