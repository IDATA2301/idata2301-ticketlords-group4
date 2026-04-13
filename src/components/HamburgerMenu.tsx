import React, { useState } from "react";
import { Link } from "react-router-dom";

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
                <Link to="categories/arts-music">
                  <div>🎶Arts & Music</div>
                </Link>
                <Link to="categories/cinema">
                  <div>✋😐🤚Cinema</div>
                </Link>
                <Link to="categories/cultural">
                  <div>🌍Cultural</div>
                </Link>
                <Link to="categories/food-drinks">
                  <div>🍜Food & Drinks</div>
                </Link>
                <Link to="categories/sports">
                  <div>🏋️Sports</div>
                </Link>
                <Link to="categories">
                  <div>More</div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
