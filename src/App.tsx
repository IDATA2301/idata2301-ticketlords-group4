import React, { useRef, useState, useEffect } from "react";
import "./css/HamburgerMenu.css";
import "./css/Slider.css";

import { scrollByOne, slide } from "./functions/sliderHelper.ts";
import HamburgerMenu from "./components/HamburgerMenu.tsx";
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

  const handleScroll = (direction: "left" | "right") => {
    const container = sliderRef.current;
    if (window.innerWidth > 600) {
      slide(container, direction);
    } else {
      scrollByOne(container, direction);
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
                    onClick={() => handleScroll("left")}
                  >
                    <img
                      src="/src/assets/arrow-left.png"
                      alt="Arrow left icon"
                    />
                  </button>
                )}
              </div>
              <div className="category-items" ref={sliderRef}>
                <div className="category-item">
                  <img src="/src/assets/hispanic-cultural.png" />
                </div>
                <div className="category-item">
                  <img src="/src/assets/beach-sunset.png" />
                </div>
                <div className="category-item">
                  <img
                    src="/src/assets/lord-of-the-rings-triology.png"
                    alt="lord of the rings triology poster"
                  />
                </div>
                <div className="category-item">
                  <img
                    src="/src/assets/cosplay-convention.png"
                    alt="cosplay convention image"
                  />
                </div>
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
                    onClick={() => handleScroll("right")}
                  >
                    <img
                      src="/src/assets/arrow-right.png"
                      alt="Arrow right icon"
                    />
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
