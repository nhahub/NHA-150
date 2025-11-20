import "./login.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext.jsx";


function Login() {

  const {updateUser}=useContext(AuthContext)
  const navigate = useNavigate();
  const [err,setErr]=useState("");
  const [isLoading,setIsLoading]=useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErr("");
    const formData=new FormData(e.target);
    const username=formData.get("username");
    const password=formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
 
      updateUser(res.data.user);
      navigate("/");
      

    } catch (err) {
      console.error("login error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Login failed";
      setErr(msg);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required min={3} max={20} type="text" placeholder="Username" />
          <input name="password" type="password" required placeholder="Password" />
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
