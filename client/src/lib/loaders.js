import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({request,params}) => {
  try {
    const res = await apiRequest("/posts/"+params.id);
    
    return res.data;
  } catch (error) {
    console.error("Error in singlePageLoader:", error);
    return { error: error.message || "Failed to load data" };
  }
};

export const listPageLoader = async ({request,params}) => {
  const query=request.url.split("?")[1]||"";

    const postPromise = apiRequest("/posts?"+query);
    
    return defer({
      postResponse:postPromise
    });
    

};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};

export const agentsPageLoader = async () => {
  try {
    const agentsPromise = apiRequest("/users/agents");
    return defer({
      agentsResponse: agentsPromise,
    });
  } catch (error) {
    console.error("Error in agentsPageLoader:", error);
    return defer({
      agentsResponse: Promise.resolve({ data: [] }),
    });
  }
};