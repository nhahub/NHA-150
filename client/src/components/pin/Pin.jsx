// Marker and Popup components from React Leaflet to display map markers with info
import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link, useNavigate } from "react-router-dom";

function Pin({ item }) {
  // Using navigate in case I want to redirect the user later (even though not used directly here)
  const navigate = useNavigate();

  // If the post doesn't have valid coordinates, don't render the marker
  if (!item.latitude || !item.longitude) {
    return null;
  }

  // Making sure latitude/longitude are numbers (sometimes they come as strings)
  const lat = typeof item.latitude === "string" ? parseFloat(item.latitude) : item.latitude;
  const lng = typeof item.longitude === "string" ? parseFloat(item.longitude) : item.longitude;

  // Getting the thumbnail image — if there are images take the first one, otherwise fallback
  const thumb = (item.images && item.images.length > 0) ? item.images[0] : item.img;

  return (
    // Rendering the marker on the map at the item's coordinates
    <Marker position={[lat, lng]}>
      <Popup>
        {/* Customized popup design for the post preview */}
        <div className="popupContainer">
          <img src={thumb || "/noimage.jpg"} alt="" />
          <div className="textContainer">
            {/* Clicking the title takes the user to the full single post page */}
            <Link to={`/${item.id}`}>{item.title}</Link>

            {/* Basic info shown in the popup */}
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
