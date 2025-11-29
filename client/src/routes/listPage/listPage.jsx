// this page lists all properties with filter and map
// imports
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useSearchParams, useRevalidator } from "react-router-dom";
import { Suspense, useContext } from "react";
import { LanguageContext } from '../../../context/languageContext';
import { SpinnerDotted } from 'spinners-react';
<SpinnerDotted  size={50}  thickness={150} speed={200} color="#F5803C"/>

function ListPage() {

  // Getting data loaded by the route loader
  const data = useLoaderData();
  const [searchParams] = useSearchParams();
  const userID = searchParams.get("userID");

  // Getting translation function from LanguageContext
  const { t } = useContext(LanguageContext);

  // Revalidator to refresh data after actions like delete
  const revalidator = useRevalidator();

  // Handle post deletion by revalidating data
  const handleDelete = (postId) => {
    revalidator.revalidate();
  };

  return (
    // Main container for the list page
    <div className="listPage">   
      <div className="listContainer">
        <div className="wrapper">
          <div className="listHeader">
            {/*  if the userID is present, show agent's properties, otherwise show available properties */}
            <h1>{userID ? t("agentsProperties") : t("availableProperties")}</h1>
            <p>{userID ? t("propertiesByAgent") : t("discoverProperty")}</p>
          </div>
          {/* filter the posts in the listpage */}
          <Filter />
          {/* suspense  */}
          <Suspense fallback={<div className="loading"><SpinnerDotted  size={50}  thickness={150} speed={200} color="#F5803C"/></div>}>
            <Await resolve={data.postResponse} errorElement={<p>{t("errorLoadingPosts")}</p>}>
              {/* if no posts found returj there is no posts found */}
              {(postResponse) => {
                if (!postResponse?.data || postResponse.data.length === 0) {
                  return <div className="noPosts">{t("noPostsFound")}</div>;
                }
                
                // get agent name from the first post's user data
                const agentName = postResponse.data[0]?.user?.username;
                return (
                  <>
                    {/* agent information */}
                    {userID && agentName && (
                      <div className="agentInfo">
                        <p>{t("propertiesBy")} <strong>{agentName}</strong></p>
                      </div>
                    )}
                    {/* number of posts */}
                    <div className="postsCount">
                      <span>{postResponse.data.length} {postResponse.data.length === 1 ? t("propertyFound") : t("propertiesFound")}</span>
                    </div>
                    
                    {postResponse.data.map((post) => (
                      // render each post as a Card component
                      <Card key={post.id} item={post} onDelete={handleDelete} />
                    ))}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
      {/* map container */}
      <div className="mapContainer">
        <Suspense fallback={<div><SpinnerDotted  size={50}  thickness={150} speed={200} color="#F5803C"/></div>}>
            <Await resolve={data.postResponse} errorElement={<p>{t("errorLoadingPosts")}</p>}>
              {/* Map component with props postResponse.data if exists , if not props is empty array */}
              {(postResponse) => <Map items={postResponse?.data || []} />}
            </Await>
          </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
