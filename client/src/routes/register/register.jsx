import "./register.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [error,setError]=useState("");
  const [isLoading,setIsLoading]=useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData=new FormData(e.target);
    const username=formData.get("username");
    const email=formData.get("email");
    const password=formData.get("password");
    console.log({
      username,
      email,
      password
    })
    try {
      const res=await apiRequest.post("/auth/register",{
        username,
        email,
        password
      });
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      setError(err.response.data.message);
      console.error("register error:", err);
      let msg =err?.response?.data?.message ||
      err?.response?.data?.error ||
      (typeof err?.response?.data === "string" ? err.response.data : null) ||
      err?.message ||"Registration failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button  disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
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
