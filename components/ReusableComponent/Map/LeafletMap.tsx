import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import L from "leaflet";
import { CircleMarker, Popup, useMapEvents, Marker } from "react-leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

if (typeof window !== "undefined") {
  require("leaflet/dist/leaflet.css");
}

import "leaflet/dist/leaflet.css"; // Dynamically loaded on the client side

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

  const CircleMarkerNoSSR = dynamic(
    () => import("react-leaflet").then((mod) => mod.CircleMarker),
    { ssr: false }
  );
  const PopupNoSSR = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
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

    return (
      <CircleMarker
        center={{
          lat: position?.lat ? position?.lat : 0,
          lng: position?.lng ? position?.lng : 0,
        }}
        radius={10}
      >
        <Popup>{truckName}</Popup>
      </CircleMarker>
    );
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
        {/* <LocationMarker /> */}

        <CircleMarkerNoSSR center={coordinates} radius={5}>
          <PopupNoSSR>{truckName}</PopupNoSSR>
        </CircleMarkerNoSSR>

        {/* <Marker position={coordinates} icon={markerIcon}>
          <PopupNoSSR>{truckName}</PopupNoSSR>
        </Marker> */}

        {/* <MarkerNoSSR position={coordinates}>
          <PopupNoSSR>
            A pretty CSS3 popup. <br /> Easily customizable.
          </PopupNoSSR>
        </MarkerNoSSR> */}
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
