import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
    const getInitialUser = () => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            return null;
        }
    };

    const [currentUser, setCurrentUser] = useState(getInitialUser);

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


    const updateUser=(data)=>{
        setCurrentUser(data);
    };
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);
    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};