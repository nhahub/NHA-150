import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link, useNavigate } from "react-router-dom";

function Pin({ item }) {
  const navigate = useNavigate();

  const lat = typeof item.latitude === "string" ? parseFloat(item.latitude) : item.latitude;
  const lng = typeof item.longitude === "string" ? parseFloat(item.longitude) : item.longitude;

  const thumb = (item.images && item.images.length > 0) ? item.images[0] : item.img;

  return (
    <Marker position={[lat, lng]}>
      <Popup>
        <div className="popupContainer">
          <img src={thumb || "/noimage.jpg"} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
