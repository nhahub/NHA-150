import { useState, useContext } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { LanguageContext } from "../../../context/languageContext";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useContext(LanguageContext);
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        {t("search")} {searchParams.get("city") && <><b>{searchParams.get("city")}</b></>}
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">{t("address")}</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder={t("city")}
            onChange={handleChange}
            defaultValue={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">{t("type")}</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">{t("any")}</option>
            <option value="buy">{t("buy")}</option>
            <option value="rent">{t("rent")}</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">{t("property")}</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">{t("any")}</option>
            <option value="apartment">{t("apartment")}</option>
            <option value="house">{t("house")}</option>
            <option value="condo">{t("condo")}</option>
            <option value="land">{t("land")}</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">{t("price")} (Min)</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder={t("any")}
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">{t("price")} (Max)</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder={t("any")}
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">{t("bedroom")}</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder={t("any")}
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
}

export default Filter;