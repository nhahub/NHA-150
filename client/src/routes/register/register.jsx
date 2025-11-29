// Register page component
// - Presents a user registration form
// - Submits form values to the /auth/register endpoint
// - Redirects to login on success
// Styles for the register page
import "./register.scss";
import { Link } from "react-router-dom";
// API helper (Axios wrapper) used to call backend endpoints
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  // Local UI state: error message and loading indicator for the form
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // React Router navigate helper to redirect after successful registration
  const navigate = useNavigate();

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    console.log({
      username,
      email,
      password,
    });
    try {
      // Call backend to create a new user
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      // On success redirect users to login screen
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      // Gracefully capture error message shapes returned by the backend
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
      console.error("register error:", err);
      let msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };
  // Render registration form and brand image
  return (
    <div className="registerPage">
      <div className="formContainer">
        {/* Form uses uncontrolled inputs read via FormData in handleSubmit */}
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          {/* Collect username, email and password — validated on the server */}
          <input 
            name="username" 
            type="text" 
            placeholder="Username" 
            required 
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="Username must be 3-20 characters (letters, numbers, underscore only)"
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            required 
            minLength={5}
            maxLength={50}
            title="Please enter a valid email address"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required 
            minLength={6}
            maxLength={50}
            title="Password must be at least 6 characters"
          />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          {/* Quick link to the login page for existing users */}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/logo.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
// export default Register: the component is used by the route system