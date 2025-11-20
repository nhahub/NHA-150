import { useContext } from "react";
import { LanguageContext } from "../../../context/languageContext";
import "./aboutPage.scss";

function AboutPage() {
  const { t } = useContext(LanguageContext);

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
          <div className="section">
            <div className="sectionContent">
              <h2>{t("ourMission")}</h2>
              <p>{t("missionText")}</p>
            </div>
            <div className="sectionImage">
              <div className="imagePlaceholder">
                <svg viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="currentColor" opacity="0.1"/>
                  <path d="M200 100L240 180H160L200 100Z" fill="currentColor" opacity="0.3"/>
                  <circle cx="200" cy="140" r="40" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="section reverse">
            <div className="sectionContent">
              <h2>{t("ourVision")}</h2>
              <p>{t("visionText")}</p>
            </div>
            <div className="sectionImage">
              <div className="imagePlaceholder">
                <svg viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="currentColor" opacity="0.1"/>
                  <path d="M200 100L240 180H160L200 100Z" fill="currentColor" opacity="0.3"/>
                  <circle cx="200" cy="140" r="40" fill="currentColor" opacity="0.3"/>
                </svg>
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

