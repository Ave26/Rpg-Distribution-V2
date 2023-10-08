// import React from "react";
// import PropTypes from "prop-types";

// function MapRealTimeUpdate(props: unknown) {
//   return <div>MapRealTimeUpdate</div>;
// }

// MapRealTimeUpdate.propTypes = {};

// export default MapRealTimeUpdate;
import React from "react";
import GoogleMapReact from "google-map-react";

import {
  TCoordinates,
  TDeliveryTrigger,
  TLocationEntry,
} from "@/types/deliveryTypes";

const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

type TMapRealTimeUpdateProps = {
  coordinates: TCoordinates | null;
};

export default function MapRealTimeUpdate({
  coordinates,
}: TMapRealTimeUpdateProps) {
  const defaultProps = {
    center: {
      lat: 10.99839602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}>
        <AnyReactComponent
          lat={coordinates?.latitude}
          lng={coordinates?.longitude}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}
