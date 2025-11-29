// this file defines the authentication context for the application
// imports
import { createContext, useState, useEffect } from "react";

// create AuthContext
export const AuthContext = createContext(null);

// AuthContext provider component
export const AuthContextProvider = ({ children }) => {
    const getInitialUser = () => {
        try {
            // retrieve user data from localStorage
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            return null;
        }
    };

    // state to hold the current user
    const [currentUser, setCurrentUser] = useState(getInitialUser);

    // effect to update localStorage whenever currentUser changes
    useEffect(() => {
        try {
            if (currentUser === null) {
                localStorage.removeItem("user");
            } else {
                localStorage.setItem("user", JSON.stringify(currentUser));
            }
        } catch (err) {
            console.error("Failed to write user to localStorage:", err);
        }
    }, [currentUser]);

    // function to update the current user
    const updateUser=(data)=>{
        setCurrentUser(data);
    };

    // effect to sync localStorage on currentUser change
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        // provide currentUser and updateUser function to children components
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};