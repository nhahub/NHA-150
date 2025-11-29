import { useContext, Suspense } from "react";
import { LanguageContext } from "../../../context/languageContext";
import { useLoaderData, Await, useNavigate } from "react-router-dom";
import { SpinnerDotted } from 'spinners-react';

import "./agentsPage.scss";

function AgentsPage() {
  const { t, language } = useContext(LanguageContext);

  // Load agents data from route
  const data = useLoaderData();
  const navigate = useNavigate();

  // Navigate to agent's property listings when profile is clicked
  const handleViewProfile = (agentId) => {
    navigate(`/list?userID=${agentId}`);
  };

  return (
    <div className="agentsPage">
      {/* Hero section with page title and description */}
      <div className="hero">
        <div className="container">
          <h1 className="title">{t("agentsTitle")}</h1>
          <p className="subtitle">{t("agentsSubtitle")}</p>
          <p className="description">{t("agentsDescription")}</p>
        </div>
      </div>

      <div className="content">
        <div className="container">
          {/* Show spinner while data is loading */}
          <Suspense fallback={<div className="loading"><SpinnerDotted  size={50}  thickness={150} speed={200} color="#F5803C"/></div>}>
            <Await resolve={data.agentsResponse} errorElement={<p>Error loading agents.</p>}>
              {(agentsResponse) => {
                const agents = agentsResponse?.data || [];
                
                if (agents.length === 0) {
                  return <div className="noAgents">No agents found.</div>;
                }

                return (
                  <div className="agentsGrid">
                    {agents.map((agent) => (
                      <div key={agent.id} className="agentCard">
                        <div className="agentImage">
                          <img src={agent.avatar || "/noavatar.jpg"} alt={agent.username} />
                        </div>
                        <div className="agentInfo">
                          <h2>{agent.username}</h2>
                          <div className="agentStats">
                            <div className="stat">
                              <span className="statValue">{agent.propertiesSold}+</span>
                              <span className="statLabel">{t("propertiesSold")}</span>
                            </div>
                            <div className="stat">
                              <span className="statValue">{agent.yearsExperience}</span>
                              <span className="statLabel">{t("yearsExperience")}</span>
                            </div>
                          </div>
                          <div className="agentDetails">
                            <div className="detailItem">
                              <strong>{t("specialties")}:</strong>
                              <span>
                                {/* Show Arabic specialties if language is Arabic, otherwise English */}
                                {language === "ar"
                                  ? agent.specialtiesAr?.join(", ") || agent.specialties?.join(", ")
                                  : agent.specialties?.join(", ") || ""}
                              </span>
                            </div>
                            <div className="detailItem">
                              <strong>{t("languages")}:</strong>
                              <span>
                                {/* Show Arabic languages if language is Arabic, otherwise English */}
                                {language === "ar"
                                  ? agent.languagesAr?.join(", ") || agent.languages?.join(", ")
                                  : agent.languages?.join(", ") || ""}
                              </span>
                            </div>
                            <div className="detailItem">
                              <strong>Email:</strong>
                              <span>{agent.email}</span>
                            </div>
                          </div>
                          <button className="viewProfileBtn" onClick={() => handleViewProfile(agent.id)}>{t("viewProfile")}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;
