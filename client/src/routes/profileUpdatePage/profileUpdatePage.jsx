import { useState } from "react";
import { AuthContext } from "../../../context/authContext";
import "./profileUpdatePage.scss";
import { useContext } from 'react';
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from 'react-router-dom';
import UploadWidget from "../../components/uploadWidget/uploadWidget";



function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [err, setErr] = useState("");
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    if (!currentUser || !currentUser.id) {
      setErr("You must be logged in to update your profile.");
      return;
    }

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      navigate("/profile");
      console.log("Update success:", res.data);
    } catch (err) {
      console.error("Update error:", err);
      const msg = err?.response?.data?.message || err?.message || "Update failed";
      setErr(msg);
    }
  };
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handlesubmit} >
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser?.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser?.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button >Update</button>
          {err && <span>{err}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] ||currentUser.avatar || "/noavatar.jpg"} alt="" className="avatar" />
        <UploadWidget
          uwConfig={{
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dog8lzbc4",
            uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
            sources: ["local", "url", "camera"],
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
