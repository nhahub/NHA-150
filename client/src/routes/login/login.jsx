// Styles for the login page
import "./login.scss";
import { Link } from "react-router-dom";
// apiRequest is a thin axios wrapper configured for our backend
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext.jsx";

// Login component: renders the auth form and handles user sign-in
function Login() {
  // pull updateUser from AuthContext to set authenticated user after login
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // ui state: err holds form/server error messages; isLoading disables submit
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Form submit handler: reads input values, calls API and updates auth state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErr("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // call backend to authenticate user credentials
    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      // set the authenticated user in global context
      updateUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.error("login error:", err);
      // try to normalize various server error shapes into one message
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Login failed";
      setErr(msg);
    } finally {
      setIsLoading(false);
    }
  };
  // render two columns: the login form and a logo image column
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
            title="Username must be 3-20 characters"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={50}
            placeholder="Password"
            title="Password must be at least 6 characters"
          />
          <button disabled={isLoading}>Login</button>
          {err && <span>{err}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/logo.png" alt="" />
      </div>
    </div>
  );
}

export default Login;