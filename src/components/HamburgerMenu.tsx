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
                <div>🎶Arts & Music</div>
                <div>✋😐🤚Cinema</div>
                <div>🌍Cultural</div>
                <div>🍜Food & Drinks</div>
                <div>🏋️Sports</div>
                <div>More</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HamburgerMenu;
