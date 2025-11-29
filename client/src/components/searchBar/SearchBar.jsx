import { useState, useContext } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../../context/languageContext";

const types = ["any", "buy", "rent"];

function SearchBar() {
  const { t } = useContext(LanguageContext);
  
  // Track all search parameters in a single state object
  const [query, setQuery] = useState({
    type: "any",
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  // Update property type when user clicks type buttons
  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  // Handle input changes for city and price fields
  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Build the URL with query parameters for the list page
  // Called when user calls the search button
  const buildListUrl = () => {
    const params = new URLSearchParams();

    // Each if condition checks whether there is a value before appending or not
    if (query.type && query.type !== "any") {
      params.append("type", query.type);
    }
    if (query.city) {
      params.append("city", query.city);
    }
    if (query.minPrice) {
      params.append("minPrice", query.minPrice);
    }
    if (query.maxPrice) {
      params.append("maxPrice", query.maxPrice);
    }
    return `/list?${params.toString()}`;
  };

  // Get translated label for each property type
  const getTypeLabel = (type) => {
    if (type === "any") return t("any");
    if (type === "buy") return t("buy");
    if (type === "rent") return t("rent");
    return type;
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {getTypeLabel(type)}
          </button>
        ))}
      </div>
      <form>
        <input
          type="text"
          name="city"
          placeholder={t("city")}
          value={query.city}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder={t("minPrice")}
          value={query.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder={t("maxPrice")}
          value={query.maxPrice}
          onChange={handleChange}
        />
        <Link to={buildListUrl()}>
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;