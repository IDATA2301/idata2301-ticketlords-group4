import React, { useState } from "react";
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
                <a href="#categories/arts-music">
                  <div>🎶Arts & Music</div>
                </a>
                <a href="#categories/cinema">
                  <div>✋😐🤚Cinema</div>
                </a>
                <a href="#categories/cultural">
                  <div>🌍Cultural</div>
                </a>
                <a href="#categories/food-drinks">
                  <div>🍜Food & Drinks</div>
                </a>
                <a href="#categories/sports">
                  <div>🏋️Sports</div>
                </a>
                <a href="#categories">
                  <div>More</div>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
