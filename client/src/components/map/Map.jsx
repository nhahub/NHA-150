// React Leaflet imports for rendering the map and tiles
import { MapContainer, TileLayer } from 'react-leaflet'
import './map.scss'
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';

// Fixing Leaflet default icon issue (especially happens in production builds)
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Creating a custom default icon because Leaflet's default icon paths break after build
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],          // Standard Leaflet icon size
  iconAnchor: [12, 41],        // Anchor point to position the icon correctly on the map
});

// Applying the custom icon as the default for all markers
L.Marker.prototype.options.icon = DefaultIcon;

function Map({items}){

  return (
    <MapContainer
      // If there's only one item, center the map on it — otherwise default center
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [30.033333, 31.233334]     // Default center (Cairo coordinates)
      }
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      {/* Map tiles from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Rendering a Pin component for each item on the map */}
      {items.map(item => (
        <Pin item={item} key={item.id}/>
      ))}
    </MapContainer>
  )
}

export default Map
