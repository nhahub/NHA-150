// About page component: informational content about the project/team
import { useContext } from "react";
import { LanguageContext } from "../../../context/languageContext";
import "./aboutPage.scss";

function AboutPage() {
  // translation helper from LanguageContext (t(key) -> translated string)
  const { t } = useContext(LanguageContext);

  // Layout: hero header + content sections (mission, vision, values)
  return (
    <div className="aboutPage">
      <div className="hero">
        <div className="container">
          <h1 className="title">{t("aboutTitle")}</h1>
          <p className="subtitle">{t("aboutSubtitle")}</p>
          <p className="description">{t("aboutDescription")}</p>
        </div>
      </div>

      <div className="content">
        <div className="container">
          {/* Mission section: explains the project's mission */}
          <div className="section">
            <div className="sectionContent">
              <h2>{t("ourMission")}</h2>
              <p>{t("missionText")}</p>
            </div>
            <div className="sectionImage">
              <div className="imagePlaceholder">
                <svg viewBox="0 0 400 300" fill="none">
                  <rect
                    width="400"
                    height="300"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <path
                    d="M200 100L240 180H160L200 100Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  <circle
                    cx="200"
                    cy="140"
                    r="40"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Vision section: reversed layout for visual variety */}
          <div className="section reverse">
            <div className="sectionContent">
              <h2>{t("ourVision")}</h2>
              <p>{t("visionText")}</p>
            </div>
            <div className="sectionImage">
              <div className="imagePlaceholder">
                <svg viewBox="0 0 400 300" fill="none">
                  <rect
                    width="400"
                    height="300"
                    fill="currentColor"
                    opacity="0.1"
                  />
                  <path
                    d="M200 100L240 180H160L200 100Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  <circle
                    cx="200"
                    cy="140"
                    r="40"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Values grid: list of core values with icons */}
          <div className="valuesSection">
            <h2>{t("ourValues")}</h2>
            <div className="valuesGrid">
              <div className="valueCard">
                <div className="valueIcon">✓</div>
                <h3>{t("value1")}</h3>
                <p>{t("value1Desc")}</p>
              </div>
              <div className="valueCard">
                <div className="valueIcon">★</div>
                <h3>{t("value2")}</h3>
                <p>{t("value2Desc")}</p>
              </div>
              <div className="valueCard">
                <div className="valueIcon">❤</div>
                <h3>{t("value3")}</h3>
                <p>{t("value3Desc")}</p>
              </div>
            </div>
          </div>
          {/* Special thanks section */}
          <div className="specialThanks">
            <h2>Special Thanks</h2>
            <p>
              We would like to extend our sincere appreciation to{" "}
              <strong>Eng. Basma Abdel Halim</strong> for her distinguished
              guidance and unwavering support throughout our participation in
              the Digital Egypt Pioneers Initiative. Her mentorship has been
              integral to enhancing our knowledge and strengthening our
              capabilities.
            </p>
            <p>
              Her extensive technical expertise, insightful feedback, and
              steadfast commitment to fostering innovation have significantly
              contributed to the advancement and success of our work. She has
              consistently provided clear direction and effective solutions,
              enabling us to address challenges with confidence and precision.
            </p>
            <p>
              We are deeply grateful for the opportunity to learn and grow under
              her exemplary leadership. Her professionalism and dedication have
              left a profound impact on our journey, and we truly value her
              continued efforts in guiding and supporting us at every stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;