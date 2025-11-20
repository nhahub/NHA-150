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
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const isOwner = currentUser && post.userID === currentUser.id;

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
      alert(t("failedSave"));
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (isOwner) {
      alert(t("cannotMessageYourself"));
      return;
    }

    try {
      const res = await apiRequest.post("/chats", { receiverId: post.userID });
      navigate("/profile", { state: { openChatId: res.data.id, openReceiverId: post.userID } });
    } catch (err) {
      console.error("Error creating chat:", err);
      alert(t("failedMessage"));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await apiRequest.delete(`/posts/${post.id}`);
        navigate("/list");
      } catch (err) {
        console.error("Error deleting post:", err);
        const errorMsg = err.response?.data?.error || err.message || t("failedDelete");
        alert(errorMsg);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
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
          <p className="title">{t("general")}</p>
          <div className="listVertical">
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
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>{t("incomePolicy")}</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
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
          <p className="title">{t("nearbyPlaces")}</p>
          <div className="listHorizontal">
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
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>{t("busStop")}</span>
                <p>{post.postDetail.bus}m {t("away")}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>{t("restaurant")}</span>
                <p>{post.postDetail.restaurant}m {t("away")}</p>
              </div>
            </div>
          </div>
          <p className="title">{t("location")}</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
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
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              {t("sendMessage")}
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
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