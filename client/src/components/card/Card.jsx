// this file contains the Card component to display individual property listings
// imports

import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import "./card.scss";
import { AuthContext } from "../../../context/authContext";
import { LanguageContext } from "../../../context/languageContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";


// Card component definition takes item prop representing the property data
function Card({ item, onDelete, onSave }) {

  // Getting current user and translations
  const { currentUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const isOwner = currentUser && item.userID === currentUser.id;
  const [saved, setSaved] = useState(item.isSaved || false);

  // Handle deleting the post
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();  
    
    // Ensure user is logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Confirm deletion action
    if (window.confirm(t("confirmDelete"))) {
      try {
        // Send delete request to backend
        const response = await apiRequest.delete(`/posts/${item.id}`);
        console.log("Delete success:", response);
        if (onDelete) onDelete(item.id);
      } catch (err) {
        // Handle errors during deletion
        console.error("Error deleting post:", err);
        console.error("Error response:", err.response);
        const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || t("failedDelete");
        alert(errorMessage);
      }
    }
  };

  // Handle editing the post
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${item.id}`);
  };

  // Handle saving / unsaving the post
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure user is logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // toggle saved state
    const newSavedState = !saved;
    setSaved(newSavedState);
    
    // Send request to backend to update saved status
    try {
      await apiRequest.post("/users/save", { postId: item.id });
      if (onSave) {
        onSave(item.id, newSavedState);
      }
    } catch (err) {
      // Revert saved state on error
      console.error("Error saving post:", err);
      setSaved((prev) => !prev);
      alert(t("failedSave"));
    }
  };

  // Handle sending a direct message to the post owner
  const handleSendMessage = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // make sure user is logged in
  if (!currentUser) {
    navigate("/login");
    return;
  }

  // prevent messaging yourself
  if (isOwner) {
    alert(t("cannotMessageYourself"));
    return;
  }

  try {
    // send request to api to create or open chat with the post owner
    const res = await apiRequest.post("/chats", { receiverId: item.userID });

    // navigate to profile page with chat state
    navigate("/profile", {
      state: {
        openChatId: res.data.id,
        openReceiverId: item.userID
      },
      replace: false  
    });
  } catch (err) {
    // Handle errors during chat creation
    console.error("Error creating chat:", err);
    alert(t("failedMessage"));
  }
};


  // the card component 
  return (
    
    <div className="card">
      {/* navigate to the post page */}
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>

      {/* text container */}
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} {t("bedroom")}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} {t("bathroom")}</span>
            </div>
          </div>
          <div className="icons">
            {isOwner && (
              <>
                {/* owner action buttons */}
                <button className="icon editBtn" onClick={handleEdit} title={t("editPost")}>
                  ✏️
                </button>
                <button className="icon deleteBtn" onClick={handleDelete} title={t("deletePost")}>
                  🗑️
                </button>
              </>
            )}

            {/* save button */}
            <button 
              className={`icon ${saved ? 'saved' : ''}`}
              onClick={handleSave}
              title={saved ? t("unsavePlace") : t("savePlace")}
            >
              <img src={saved ? "/unsave.png" : "/save.png"} alt={saved ? "unsave" : "save"} style={{ opacity: saved ? 1 : 0.6 }} />
            </button>
            <button 
              className="icon"
              onClick={handleSendMessage}
              title={t("sendMessage")}
            >
              <img src="/chat.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
