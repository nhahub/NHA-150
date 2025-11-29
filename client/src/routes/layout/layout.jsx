// this file defines the layout component for the application
// imports
import "./layout.scss";
import Navbar from "../../components/navbar/Navbar"
import ScrollToTop from "../../components/ScrollToTop";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";

// layout component definition
function Layout() {
  return (
    // Layout structure with Navbar and Outlet for nested routes
    <div className="layout">
      <ScrollToTop />
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  );
}
// component to enforce authentication on protected routes
function RequiredAuth() {

  // get currentUser from AuthContext
  const {currentUser,updateUser}=useContext(AuthContext);

  // if no currentUser, redirect to login page
  if(!currentUser){
    return <Navigate to="/login"/>
  }
  // if authenticated, render the layout with children routes
  return (
    // Layout structure with Navbar and Outlet for nested routes
    currentUser&&<div className="layout">
      <ScrollToTop />
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet/>
      </div>
    </div>
  );
}

export {Layout,RequiredAuth};
