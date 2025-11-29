// this component scrolls the window to the top whenever the route changes
// imports
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ScrollToTop component definition
export default function ScrollToTop() {
  const location = useLocation();

  // Effect to run on location change
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
