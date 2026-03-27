import React, { useRef, useState, useEffect } from "react";
import "./css/HamburgerMenu.css";
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
            {/*TODO: Render menu content after the hambuger menu is clicked here.*/}
          </>
        )}
      </>
    );
  };

  useEffect(() => {
    updateArrows();
    const element = sliderRef.current;
    if (!element) return;
    element.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      element.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

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
            <div className="hamburger-menu">
              <header>
                <HamburgerMenu />
              </header>
            </div>
            <a className="active" href="#Home">
              Home
            </a>
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
          <br />
          <br />


          <div className="slider">
            {canScrollLeft && (
              <button className="arrow-left" onClick={() => slide(-1)}>
                &#8592;
              </button>
            )}
            <div className="event-popular" ref={sliderRef}>
              <div className="category-item">
                Jogeir Johhnyson and The Scripts
              </div>
              <div className="category-item">The Drage vs The Liavågs</div>
              <div className="category-item">The Drage vs The Liavågs</div>
              <div className="category-item">The Drage vs The Liavågs</div>
              <div className="category-item">The Drage vs The Liavågs</div>
              <div className="category-item">
                Anjdreas and the fourth dimension
              </div>
              <div className="category-item">
                Jogeir, Funnyjunk og Bakken: En historie om kjærlighet og
                konflikt
              </div>
              <div className="category-item">Jogeir: the kid named finger</div>
            </div>
            {canScrollRight && (
              <button className="arrow-right" onClick={() => slide(1)}>
                &#8594;
              </button>
            )}
            <br />
            <br />
          </div>
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
