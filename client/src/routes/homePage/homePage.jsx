import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../../context/authContext";
import { LanguageContext } from "../../../context/languageContext";

function 
HomePage() {

  const {currentUser}=useContext(AuthContext);
  const {t}=useContext(LanguageContext);
  console.log("currentUser in home page:",currentUser);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">{t("findRealEstate")}</h1>
          <p>
            {t("homeDescription")}
          </p>
          <SearchBar />
        </div>
      </div>
      <div className="imgContainer">
        <img src="/logo.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
