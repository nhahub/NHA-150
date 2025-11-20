import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useSearchParams, useRevalidator } from "react-router-dom";
import { Suspense, useContext } from "react";
import { LanguageContext } from '../../../context/languageContext';

function ListPage() {
  const data = useLoaderData();
  const [searchParams] = useSearchParams();
  const userID = searchParams.get("userID");
  const { t } = useContext(LanguageContext);
  const revalidator = useRevalidator();

  const handleDelete = (postId) => {
    revalidator.revalidate();
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <div className="listHeader">
            <h1>{userID ? t("agentsProperties") : t("availableProperties")}</h1>
            <p>{userID ? t("propertiesByAgent") : t("discoverProperty")}</p>
          </div>
          <Filter />
          <Suspense fallback={<div className="loading">{t("loadingPosts")}</div>}>
            <Await resolve={data.postResponse} errorElement={<p>{t("errorLoadingPosts")}</p>}>
              {(postResponse) => {
                if (!postResponse?.data || postResponse.data.length === 0) {
                  return <div className="noPosts">{t("noPostsFound")}</div>;
                }
                
                const agentName = postResponse.data[0]?.user?.username;
                return (
                  <>
                    {userID && agentName && (
                      <div className="agentInfo">
                        <p>{t("propertiesBy")} <strong>{agentName}</strong></p>
                      </div>
                    )}
                    <div className="postsCount">
                      <span>{postResponse.data.length} {postResponse.data.length === 1 ? t("propertyFound") : t("propertiesFound")}</span>
                    </div>
                    {postResponse.data.map((post) => (
                      <Card key={post.id} item={post} onDelete={handleDelete} />
                    ))}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<div>{t("loadingPosts")}</div>}>
            <Await resolve={data.postResponse} errorElement={<p>{t("errorLoadingPosts")}</p>}>
              {(postResponse) => <Map items={postResponse?.data || []} />}
            </Await>
          </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
