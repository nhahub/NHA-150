import { useState, useContext } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import { LanguageContext } from "../../../context/languageContext";

function Filter() {
  // Reads URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useContext(LanguageContext);
  
  // Initialize filter state with values from URL params
  // This preserves filters when navigating back to the page
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  // Update local state as user modifies filter inputs
  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  // Apply filters by updating URL params
  const handleFilter = () => {
    setSearchParams(query);
  };

  // Handle form submission (Enter key)
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilter();
  };

  return (
    <div className="filter">
      {/* Display search header with city name if specified */}
      <h1>
        {t("search")} {searchParams.get("city") && <><b>{searchParams.get("city")}</b></>}
      </h1>
      <form onSubmit={handleSubmit}>
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
        {/* Property type selector (buy/rent) */}
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
        {/* Property category selector (apartment, house, etc.) */}
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
        {/* Min and max price range inputs */}
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
        {/* Bedroom count filter */}
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
        <button type="submit">
          <img src="/search.png" alt="" />
        </button>
      </div>
      </form>
    </div>
  );
}

export default Filter;