// this file creates a context for managing dark mode state in a React application
// imports

import { createContext, useState, useEffect } from "react";

// create DarkModeContext
export const DarkModeContext = createContext(null);

// DarkModeContext provider component
export const DarkModeContextProvider = ({ children }) => {
  const getInitialDarkMode = () => {
    try {
      // retrieve dark mode preference from localStorage
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // if no preference saved, use system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (err) {
      return false;
    }
  };

  // state to hold dark mode status
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // effect to update localStorage and document class on darkMode change
  useEffect(() => {
    try {
      // save dark mode preference to localStorage
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add("dark");     // add "dark" class to <html> element
      } else {
        document.documentElement.classList.remove("dark");  // remove "dark" class from <html>
      }
    } catch (err) {
      console.error("Failed to save dark mode:", err);
    }
  }, [darkMode]);

  // function to toggle dark mode state
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    // provide darkMode state and toggle function to children components
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

