import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { useState } from "react";
import L from "leaflet";
import { CircleMarker, Popup, useMapEvents } from "react-leaflet";

if (typeof window !== "undefined") {
  require("leaflet/dist/leaflet.css");
}
// import "leaflet/dist/leaflet.css"; // Dynamically loaded on the client side

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface LeafletMapProps {
  coordinates: [number, number];
  truckName: string;
}

function LeafletMap({ coordinates, truckName }: LeafletMapProps) {
  const MapWithNoSSR = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
  );
  const TileLayerWithNoSSR = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
  );

  function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position ? (
      <CircleMarker center={position} radius={10}>
        <Popup>{truckName}</Popup>
      </CircleMarker>
    ) : null;
  }

  return (
    <div className="overflow-hidden border border-black">
      <MapWithNoSSR
        attributionControl={false}
        center={coordinates}
        zoom={20}
        style={{ height: "35vh", width: "100%" }}
      >
        <TileLayerWithNoSSR url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapWithNoSSR>
    </div>
  );
}

export default LeafletMap;

// import { LatLng } from "leaflet";

// import dynamic from "next/dynamic";
// import { useState } from "react";
// import { Popup, useMapEvents, CircleMarker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// interface LeafletMapProps {
//   coordinates: [number, number];
//   truckName: string;
// }

// function LeafletMap({ coordinates, truckName }: LeafletMapProps) {
//   const MapWithNoSSR = dynamic(
//     () => import("react-leaflet").then((mod) => mod.MapContainer),
//     { ssr: false }
//   );
//   const TileLayerWithNoSSR = dynamic(
//     () => import("react-leaflet").then((mod) => mod.TileLayer),
//     { ssr: false }
//   );

//   const MarkerWithNoSSR = dynamic(
//     () => import("react-leaflet").then((mod) => mod.Marker),
//     { ssr: false }
//   );

//   function LocationMarker() {
//     const [position, setPosition] = useState<LatLng | null>(null);
//     const map = useMapEvents({
//       click() {
//         map.locate();
//       },
//       locationfound(e) {
//         setPosition(e.latlng);
//         map.flyTo(e.latlng, map.getZoom());
//       },
//     });

//     return (
//       <CircleMarker
//         center={position === null ? coordinates ?? null : position}
//         radius={10}
//       >
//         <Popup>{truckName}</Popup>
//       </CircleMarker>
//     );
//   }

//   return (
//     <div className="overflow-hidden border border-black">
//       <MapWithNoSSR
//         attributionControl={false}
//         center={coordinates}
//         zoom={20}
//         style={{ height: "35vh", width: "100%" }}
//       >
//         <TileLayerWithNoSSR url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <LocationMarker />
//       </MapWithNoSSR>
//     </div>
//   );
// }

// export default LeafletMap;
