import { useContext, useState, useEffect, useRef } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/authContext.jsx";
import { LanguageContext } from "../../../context/languageContext.jsx";
import { DarkModeContext } from "../../../context/darkModeContext.jsx";
import { useNotificationStore } from "../../lib/notificationStore.js";

function Navbar() {
  // Controls the state of the small-screen menu
  const [open, setOpen] = useState(false);

  // Refs used to detect clicks outside the mobile menu
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);

  // Tracks whether the navbar should appear scrolled (transparent background)
  const [scrolled, setScrolled] = useState(false);

  // Getting all context states that this component depends on
  const {currentUser}=useContext(AuthContext);
  const {t, language, toggleLanguage}=useContext(LanguageContext);
  const {darkMode, toggleDarkMode}=useContext(DarkModeContext);

  // Notification store (used to fetch unseen notifications count)
  const fetch=useNotificationStore(state=>state.fetch);
  const number=useNotificationStore(state=>state.number);

  const location = useLocation();

  // Whenever a user logs in, fetch notifications
  useEffect(() => {
    if (currentUser) fetch();
  }, [currentUser]);

  // Close menu when clicking outside — common UX pattern
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      const menuEl = menuRef.current;
      const iconEl = menuIconRef.current;

      // Only close if the click is outside both the menu and the icon
      if (menuEl && !menuEl.contains(e.target) && iconEl && !iconEl.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close mobile menu automatically when resizing into desktop layout
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 738 && open) {
        setOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Detect scroll to change background style (only for bigger screens)
  useEffect(() => {
    function handleScroll() {
      if (window.innerWidth <= 738) {
        // For small screens, navbar stays solid — no scrolled effect needed
        if (scrolled) setScrolled(false);
        return;
      }

      // Navbar becomes semi-transparent after some scrolling
      setScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once initially

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <nav className={scrolled ? "scrolled" : undefined}>
      <div className="left">
        {/* Logo + main navigation links */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>Estately</span>
        </Link>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>{t("home")}</Link>
        <Link to="/agents" className={location.pathname.startsWith("/agents") ? "active" : ""}>{t("agents")}</Link>
        <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>{t("contact")}</Link>
        <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>{t("about")}</Link>
        
      </div>

      <div className="right">
        {/* Language + dark mode toggles */}
        <div className="controls">
          <button className="langToggle" onClick={toggleLanguage} title={language === "en" ? "العربية" : "English"}>
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button className="darkModeToggle" onClick={toggleDarkMode} title={darkMode ? t("lightMode") : t("darkMode")}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Authenticated user block */}
        {currentUser ? (
          <div className="user">
            {/* Fallback avatar in case user has none */}
            <img
              src={currentUser.avatar ||"/noavatar.jpg"}
              alt=""
            />
            <span>{currentUser.username}</span>

            {/* Profile link + notification badge */}
            <Link to="/profile" className={location.pathname === "/profile" ? "profile active" : "profile"}>
             {number>0 && <div className="notification">{number}</div>}
              <span>{t("profile")}</span>
            </Link>
          </div>
        ) : (
          // Links shown when the user is NOT logged in
          <>
            <Link to="/login">{t("signIn")}</Link>
            <Link to="/register" className="register">
              {t("signUp")}
            </Link>
          </>
        )}

        {/* Mobile menu icon */}
        <div className="menuIcon" ref={menuIconRef}>
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        {/* Mobile dropdown menu */}
        <div className={open ? "menu active" : "menu"} ref={menuRef}>
          <div className="menuControls">
            {/* Same controls but inside the mobile menu */}
            <button className="langToggle" onClick={toggleLanguage} title={language === "en" ? "العربية" : "English"}>
              {language === "en" ? "عربي" : "EN"}
            </button>
            <button className="darkModeToggle" onClick={toggleDarkMode} title={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Menu navigation links */}
          <Link to="/" onClick={() => setOpen(false)} className={location.pathname === "/" ? "active" : ""}><span>{t("home")}</span></Link>
          <Link to="/agents" onClick={() => setOpen(false)} className={location.pathname.startsWith("/agents") ? "active" : ""}><span>{t("agents")}</span></Link>
          <Link to="/contact" onClick={() => setOpen(false)} className={location.pathname === "/contact" ? "active" : ""}><span>{t("contact")}</span></Link>
          <Link to="/about" onClick={() => setOpen(false)} className={location.pathname === "/about" ? "active" : ""}><span>{t("about")}</span></Link>

          {/* Auth-dependent menu entries */}
          {!currentUser && (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className={location.pathname === "/login" ? "active" : ""}><span>{t("signIn")}</span></Link>
              <Link to="/register" onClick={() => setOpen(false)} className={location.pathname === "/register" ? "active" : ""}><span>{t("signUp")}</span></Link>
            </>
          )}
          {currentUser && (
            <Link to="/profile" onClick={() => setOpen(false)} className={location.pathname === "/profile" ? "active" : ""}><span>{t("profile")}</span></Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
