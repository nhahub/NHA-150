// This page is responsible for displaying the full details of a single post/ad.
// It shows images, description, map location, and interaction buttons (save, message, edit, delete).
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";

import apiRequest from "../../lib/apiRequest";
import { AuthContext } from './../../../context/authContext';
import { LanguageContext } from '../../../context/languageContext';

function SinglePage() {
  // Getting post data loaded by the route loader
  const post = useLoaderData();

  // Local state to track whether the post is saved by the user
  const [saved, setSaved] = useState(post.isSaved);

  // Getting current logged user and translations
  const { currentUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  // Navigation hook
  const navigate = useNavigate();

  // Checking if the logged-in user is the owner of the post
  const isOwner = currentUser && post.userID === currentUser.id;

  // Handle saving / unsaving the post
  const handleSave = async () => {
    // If the user is not logged in, redirect to login page
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Optimistic UI update (change before server response)
    setSaved((prev) => !prev);

    try {
      // Send request to toggle save status in backend
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      // If server failed, revert UI state
      setSaved((prev) => !prev);
      alert(t("failedSave"));
    }
  };

  // Handle sending a direct message to the post owner
  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Block messaging yourself
    if (isOwner) {
      alert(t("cannotMessageYourself"));
      return;
    }

    try {
      // Create or open chat with the post owner
      const res = await apiRequest.post("/chats", { receiverId: post.userID });
      navigate("/profile", { state: { openChatId: res.data.id, openReceiverId: post.userID } });
    } catch (err) {
      console.error("Error creating chat:", err);
      alert(t("failedMessage"));
    }
  };

  // Handle deleting a post (owner only)
  const handleDelete = async () => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        // Delete post from backend
        await apiRequest.delete(`/posts/${post.id}`);
        // Redirect to list page after deletion
        navigate("/list");
      } catch (err) {
        console.error("Error deleting post:", err);
        const errorMsg = err.response?.data?.error || err.message || t("failedDelete");
        alert(errorMsg);
      }
    }
  };

  // Redirect to edit page
  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          {/* Image slider for the post's pictures */}
          <Slider images={post.images} />

          <div className="info">
            <div className="top">
              <div className="post">
                {/* Title, address, and price */}
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>

              {/* Owner user info */}
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>

            {/* Post description — sanitized to prevent XSS */}
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">

          {/* General features section */}
          <p className="title">{t("general")}</p>
          <div className="listVertical">

            {/* Utilities responsibility */}
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>{t("utilities")}</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>{t("ownerResponsible")}</p>
                ) : (
                  <p>{t("tenantResponsible")}</p>
                )}
              </div>
            </div>

            {/* Pet policy */}
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>{t("petPolicy")}</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>{t("petsAllowed")}</p>
                ) : (
                  <p>{t("petsNotAllowed")}</p>
                )}
              </div>
            </div>

            {/* Income policy */}
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>{t("incomePolicy")}</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>

          {/* Sizes section */}
          <p className="title">{t("sizes")}</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} {t("sqft")}</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} {t("beds")}</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} {t("bathroom")}</span>
            </div>
          </div>

          {/* Nearby places section */}
          <p className="title">{t("nearbyPlaces")}</p>
          <div className="listHorizontal">

            {/* Schools */}
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>{t("school")}</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  {t("away")}
                </p>
              </div>
            </div>

            {/* Bus stop */}
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>{t("busStop")}</span>
                <p>{post.postDetail.bus}m {t("away")}</p>
              </div>
            </div>

            {/* Restaurant */}
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>{t("restaurant")}</span>
                <p>{post.postDetail.restaurant}m {t("away")}</p>
              </div>
            </div>
          </div>

          {/* Map section */}
          <p className="title">{t("location")}</p>
          <div className="mapContainer">
            {/* Map component expects an array so I pass [post] */}
            <Map items={[post]} />
          </div>

          {/* Buttons area */}
          <div className="buttons">

            {/* Only show edit/delete if user is the owner */}
            {isOwner && (
              <>
                <button onClick={handleEdit} className="editBtn">
                  ✏️ {t("editPost")}
                </button>
                <button onClick={handleDelete} className="deleteBtn">
                  🗑️ {t("deletePost")}
                </button>
              </>
            )}

            {/* Send message button */}
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              {t("sendMessage")}
            </button>

            {/* Save/Unsave button */}
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "var(--primary-color)" : "var(--bg-primary)",
              }}
            >
              <img src={saved ? "/unsave.png" : "/save.png"} alt="" />
              {saved ? t("unsavePlace") : t("savePlace")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
