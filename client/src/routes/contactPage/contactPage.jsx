// Contact page: displays ways to reach the team and office location
import { useContext } from "react";
import { LanguageContext } from "../../../context/languageContext";
import "./contactPage.scss";

function ContactPage() {
  // t(key) returns the translated text for the user's locale
  const { t } = useContext(LanguageContext);

  // contactMethods is a configuration array which drives the contact cards UI
  const contactMethods = [
    {
      type: "email",
      icon: "📧",
      title: t("contactEmail"),
      primary: "antonyosmilad60@gmail.com",
      secondary: "tonymilad1472005@gmail.com",
      action: "mailto:antonyosmilad60@gmail.com",
      color: "#4285F4",
    },
    {
      type: "phone",
      icon: "📞",
      title: t("phone"),
      primary: "+20 127 679 7083",
      secondary: "+20 122 552 5117",
      action: "tel:+20 127 679 7083",
      color: "#34A853",
    },
    {
      type: "whatsapp",
      icon: "💬",
      title: "WhatsApp",
      primary: "+20 122 552 5117",
      secondary: "",
      action: "https://wa.me/1225525117",
      color: "#25D366",
    },
    {
      type: "location",
      icon: "📍",
      title: t("contactAddress"),
      primary: "Alexandria, Egypt",
      secondary: "Alexandria, Egypt",
      action:
        "https://www.google.com/maps/place/Faculty+of+Engineering+-+University+of+Alexandria/@31.206247,29.9222472,17z/data=!3m1!4b1!4m6!3m5!1s0x14f5c38beb5b1711:0x39b32d42ccaf2a88!8m2!3d31.206247!4d29.9248221!16s%2Fm%2F03gs25d?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D",
      color: "#EA4335",
    },
  ];

  return (
    <div className="contactPage">
      <div className="hero">
        <div className="container">
          <div className="heroContent">
            <h1 className="title">{t("contactTitle")}</h1>
            <p className="subtitle">{t("contactSubtitle")}</p>
            <p className="description">{t("contactDescription")}</p>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          {/* Render contact method cards based on contactMethods config */}
          <div className="contactMethods">
            {contactMethods.map((method, index) => (
              <a
                key={method.type}
                href={method.action}
                target={
                  method.type === "whatsapp" || method.type === "location"
                    ? "_blank"
                    : undefined
                }
                rel={
                  method.type === "whatsapp" || method.type === "location"
                    ? "noopener noreferrer"
                    : undefined
                }
                className="contactCard"
                style={{ "--card-color": method.color }}
              >
                <div
                  className="cardIcon"
                  style={{ backgroundColor: `${method.color}15` }}
                >
                  <span>{method.icon}</span>
                </div>
                <div className="cardContent">
                  <h3>{method.title}</h3>
                  <p className="primaryText">{method.primary}</p>
                  {method.secondary && (
                    <p className="secondaryText">{method.secondary}</p>
                  )}
                </div>
                <div className="cardArrow">→</div>
              </a>
            ))}
          </div>

          {/* Working hours block: shows office schedule */}
          <div className="workingHoursSection">
            <div className="hoursCard">
              <div className="hoursIcon">🕒</div>
              <div className="hoursContent">
                <h2>{t("workingHours")}</h2>
                <div className="hoursList">
                  <div className="hoursItem">
                    <span className="day">{t("mondayFriday")}</span>
                    <span className="time">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hoursItem">
                    <span className="day">{t("saturday")}</span>
                    <span className="time">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="hoursItem">
                    <span className="day">{t("sunday")}</span>
                    <span className="time closed">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map section: embedded Google Map and link to open in full maps */}
          <div className="mapSection">
            <div className="mapCard">
              <h2>{t("visitOurOffice")}</h2>
              <div className="mapContainer">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.185234567890!2d29.9222472!3d31.206247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c38beb5b1711%3A0x39b32d42ccaf2a88!2sFaculty%20of%20Engineering%20-%20University%20of%20Alexandria!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
              <div className="mapInfo">
                <p>📍 {t("contactAddress")}: Alexandria, Egypt</p>

                <a
                  href="https://www.google.com/maps/place/Faculty+of+Engineering+-+University+of+Alexandria/@31.206247,29.9222472,17z/data=!3m1!4b1!4m6!3m5!1s0x14f5c38beb5b1711:0x39b32d42ccaf2a88!8m2!3d31.206247!4d29.9248221!16s%2Fm%2F03gs25d?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mapLink"
                >
                  {t("openInGoogleMaps")} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;