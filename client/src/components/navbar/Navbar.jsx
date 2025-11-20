import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/authContext.jsx";
import { LanguageContext } from "../../../context/languageContext.jsx";
import { DarkModeContext } from "../../../context/darkModeContext.jsx";
import { useNotificationStore } from "../../lib/notificationStore.js";

function Navbar() {
  const [open, setOpen] = useState(false);

  const {currentUser}=useContext(AuthContext);
  const {t, language, toggleLanguage}=useContext(LanguageContext);
  const {darkMode, toggleDarkMode}=useContext(DarkModeContext);
  const fetch=useNotificationStore(state=>state.fetch);
  const number=useNotificationStore(state=>state.number);
  const location = useLocation();

  useEffect(() => {
    if (currentUser) fetch();
  }, [currentUser]);
  return (
    <nav>
      <div className="left">
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
        <div className="controls">
          <button className="langToggle" onClick={toggleLanguage} title={language === "en" ? "العربية" : "English"}>
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button className="darkModeToggle" onClick={toggleDarkMode} title={darkMode ? t("lightMode") : t("darkMode")}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar ||"/noavatar.jpg"}
              alt=""
            />
            <span>{currentUser.username}</span>
            <Link to="/profile" className={location.pathname === "/profile" ? "profile active" : "profile"}>
             {number>0 && <div className="notification">{number}</div>}
              <span>{t("profile")}</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">{t("signIn")}</Link>
            <Link to="/register" className="register">
              {t("signUp")}
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <div className="menuControls">
            <button className="langToggle" onClick={toggleLanguage} title={language === "en" ? "العربية" : "English"}>
              {language === "en" ? "عربي" : "EN"}
            </button>
            <button className="darkModeToggle" onClick={toggleDarkMode} title={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
          <Link to="/" onClick={() => setOpen(false)} className={location.pathname === "/" ? "active" : ""}><span>{t("home")}</span></Link>
          <Link to="/agents" onClick={() => setOpen(false)} className={location.pathname.startsWith("/agents") ? "active" : ""}><span>{t("agents")}</span></Link>
          <Link to="/contact" onClick={() => setOpen(false)} className={location.pathname === "/contact" ? "active" : ""}><span>{t("contact")}</span></Link>
          <Link to="/about" onClick={() => setOpen(false)} className={location.pathname === "/about" ? "active" : ""}><span>{t("about")}</span></Link>

          
         
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
