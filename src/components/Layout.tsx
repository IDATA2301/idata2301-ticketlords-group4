import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../css/HamburgerMenu.css";
import "../css/Slider.css";

export default function Layout() {
  const [showTopbar, setShowTopbar] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleWindowScroll = () => {
      const currentY = window.scrollY;
      const isMobile = window.innerWidth <= 600;

      if (!isMobile) {
        setShowTopbar(true);
        lastScrollY.current = currentY;
        return;
      }

      const delta = currentY - lastScrollY.current;

      if (delta > 5 && currentY > 50) {
        setShowTopbar(false);
      } else if (delta < -5) {
        setShowTopbar(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    lastScrollY.current = 0;

    const timeoutId = window.setTimeout(() => {
      setShowTopbar(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return (
    <div id="root">
      <div className="main-content">

        {/* Topbar */}
        <div className={`topnav ${showTopbar ? "topnav--visible" : "topnav--hidden"}`}>
          <div className="topnav-left">
            <div className="hamburger-menu">
              <header>
                <HamburgerMenu />
              </header>
            </div>
          </div>
          <div className="topnav-middle">
            <Link to="/home" className="home-button">

              <img src="/src/assets/TicketLordsLogo.png" />
              <div>
                Ticket Lords
              </div>
            </Link>
          </div>
          <div className="topnav-right">
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          </div>
        </div>

        {/* Page content*/}
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="footer">
        <Link to="/about-us">About</Link>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  );
}
