import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HamburgerMenu: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
          <div className="menu-overlay">
            <div className="sidebar">
              <div className="sidebar-top">
                <div className="sidebar-event-categories">
                  <Link to="/events/category/arts-music" onClick={() => setOpen(false)}>
                    <div>🎶Arts & Music</div>
                  </Link>
                  <Link to="events/category/cinema" onClick={() => setOpen(false)}>
                    <div>✋😐🤚Cinema</div>
                  </Link>
                  <Link to="events/category/cultural" onClick={() => setOpen(false)}>
                    <div>🌍Cultural</div>
                  </Link>
                  <Link to="events/category/food-drinks" onClick={() => setOpen(false)}>
                    <div>🍜Food & Drinks</div>
                  </Link>
                  <Link to="events/category/sports" onClick={() => setOpen(false)}>
                    <div>🏋️Sports</div>
                  </Link>
                  <Link to="categories" onClick={() => setOpen(false)}>
                    <div>More</div>
                  </Link>
                </div>
              </div>

            </div>
          </div>
          <div className="sidebar-backdrop" onClick={() => setOpen(false)}></div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
