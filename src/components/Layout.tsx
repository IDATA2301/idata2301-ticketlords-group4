import {useEffect, useRef, useState} from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import { clearAuthToken, isAuthenticated } from "../util/authUtils.ts";
import HamburgerMenu from "./HamburgerMenu";
import "../css/HamburgerMenu.css";
import useIsAdminRole from "../functions/CheckAdminRole.ts";

export default function Layout() {
  const [showTopbar, setShowTopbar] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const isAdmin = useIsAdminRole(location.pathname);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

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

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="main-content">

        {/* Topbar */}
        <div className={`topnav ${showTopbar ? "topnav--visible" : "topnav--hidden"}`}>
          <div className="topnav-left">
            <div className="hamburger-menu">
              <header>
                <HamburgerMenu/>
              </header>
            </div>
          </div>
          <div className="topnav-middle">
            <Link to="/home" className="home-button">

              <img src="/TicketLordsLogo.png"/>
              <div>
                Ticket Lords
              </div>
            </Link>
          </div>
          <div className="topnav-right">
            <div>
              {isAdmin && (
                <Link to="/addevent">
                  <button className="create-event-btn">Create Event</button>
                </Link>
              )}
            </div>
            <Link to="/cart">
              <button className="cart-btn">
                <img
                  src="cart.png"
                /></button>
            </Link>

            {loggedIn ? (
              <Link to="/user-page">
                <button className="user-btn">
                  <img
                    src="user-icon.png"
                  /></button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="login-btn">Login</button>
              </Link>
            )}


          </div>
        </div>

        {/* Page content*/}
        <Outlet/>
      </div>

      {/* Footer */}
      <footer className="footer">
        <Link to="/about-us">About</Link>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  );
}
