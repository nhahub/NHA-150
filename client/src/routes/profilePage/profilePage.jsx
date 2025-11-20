import { Await, Link, useLoaderData, useNavigate, useRouteLoaderData, useRevalidator, useLocation } from "react-router-dom";
import { useNotificationStore } from "../../lib/notificationStore";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from './../../../context/authContext';
import { LanguageContext } from '../../../context/languageContext';
import { Suspense } from "react";


function ProfilePage() {
  const data=useLoaderData();
  const location = useLocation();
  const initialOpenChatId = location.state?.openChatId;
  const initialOpenReceiverId = location.state?.openReceiverId;
  const revalidator = useRevalidator();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const unreadNumber = useNotificationStore((s) => s.number);
  const fetchUnread = useNotificationStore((s) => s.fetch);

  const {currentUser,updateUser}=useContext(AuthContext);
  const {t}=useContext(LanguageContext);
  const navigate=useNavigate();

  const handleDelete = (postId) => {
    revalidator.revalidate();
  };

  const handleSave = (postId, isSaved) => {
    revalidator.revalidate();
  };

  const handleLogout=async ()=>{
    try{
      await apiRequest.post("/auth/logout");
      navigate("/home");
      updateUser(null);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    if (initialOpenChatId && initialOpenReceiverId) {
      setIsChatOpen(true);
    }
  }, [initialOpenChatId, initialOpenReceiverId]);


  useEffect(() => {
    fetchUnread();
  }, []);

  

  return (
    <div className="profilePage">
      <div className="profileHero">
        <div className="heroContent">
          <div className="avatarSection">
            <div className="avatarWrapper">
              <img
                src={currentUser?.avatar ||"/noavatar.jpg"}
                alt=""
              />
            </div>
            <div className="userInfo">
              <h1>{currentUser?.username}</h1>
              <p>{currentUser?.email}</p>
              <div className="userStats">
                <div className="stat">
                  <span className="statValue">
                    <Suspense fallback={<span>0</span>}>
                      <Await resolve={data.postResponse}>
                        {(postResponse) => postResponse?.data.userPosts?.length || 0}
                      </Await>
                    </Suspense>
                  </span>
                  <span className="statLabel">{t("myList")}</span>
                </div>
                <div className="stat">
                  <span className="statValue">
                    <Suspense fallback={<span>0</span>}>
                      <Await resolve={data.postResponse}>
                        {(postResponse) => postResponse?.data.savedPosts?.length || 0}
                      </Await>
                    </Suspense>
                  </span>
                  <span className="statLabel">{t("savedList")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="actionButtons">
            <Link to="/profile/update">
              <button className="updateBtn">
                <span>✏️</span>
                {t("updateProfile")}
              </button>
            </Link>
            <Link to="/add">
              <button className="createBtn">
                <span>➕</span>
                {t("createNewPost")}
              </button>
            </Link>
            <button onClick={handleLogout} className="logoutBtn">
              <span></span>
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="profileContent">
        <div className="contentWrapper">
          <div className="section">
            <div className="sectionHeader">
              <h2>
                <span className="icon"></span>
                {t("myList")}
              </h2>
              <Link to="/add">
                <button className="addBtn">{t("createNewPost")}</button>
              </Link>
            </div>
            <div className="sectionBody">
              <Suspense fallback={<div className="loadingState">{t("loadingPosts")}</div>}>
                <Await resolve={data.postResponse} errorElement={<p className="errorState">{t("errorLoadingPosts")}</p>}>
                  {(postResponse) => (
                    postResponse?.data.userPosts?.length > 0 ? (
                      <List posts={postResponse?.data.userPosts} onDelete={handleDelete} onSave={handleSave}/>
                    ) : (
                      <div className="emptyState">
                        <span className="emptyIcon"></span>
                        <p>{t("noPostsFound")}</p>
                        <Link to="/add">
                          <button>{t("createNewPost")}</button>
                        </Link>
                      </div>
                    )
                  )}
                </Await>
              </Suspense>
            </div>
          </div>

          <div className="section">
            <div className="sectionHeader">
              <h2>
                <span className="icon"></span>
                {t("savedList")}
              </h2>
            </div>
            <div className="sectionBody">
              <Suspense fallback={<div className="loadingState">{t("loadingPosts")}</div>}>
                <Await resolve={data.postResponse} errorElement={<p className="errorState">{t("errorLoadingPosts")}</p>}>
                  {(postResponse) => (
                    postResponse?.data.savedPosts?.length > 0 ? (
                      <List posts={postResponse?.data.savedPosts} onDelete={handleDelete} onSave={handleSave}/>
                    ) : (
                      <div className="emptyState">
                        <span className="emptyIcon">💾</span>
                        <p>No saved posts yet</p>
                      </div>
                    )
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </div>


      <div className={`chatWidget ${isChatOpen ? 'open' : ''}`}>
        <div className="chatToggle" onClick={() => setIsChatOpen(!isChatOpen)}>
          <span className="chatIcon">💬</span>
          <span className="chatBadge">
            {unreadNumber || 0}
          </span>
        </div>
        <div className="chatPopup">
          <div className="chatHeader">
            <h3>Messages</h3>
            <button className="closeChat" onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          <div className="chatContent">
            <Suspense fallback={<div className="loadingState">Loading chats...</div>}>
              <Await resolve={data.chatResponse} errorElement={<p className="errorState">Error loading chats.</p>}>
                {(chatResponse) => <Chat chats={chatResponse?.data} initialOpenChatId={initialOpenChatId} initialOpenReceiverId={initialOpenReceiverId} />}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
