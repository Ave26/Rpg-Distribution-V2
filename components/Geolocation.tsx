import { useEffect, useState } from "react";

type LocationEntry = {
  latitude: number;
  longitude: number;
  timestamp: string;
};

const Geolocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationLog, setLocationLog] = useState<LocationEntry[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in window.navigator) {
      const watchId = window.navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationLog((prevLog) => [
            ...prevLog,
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString(),
            },
          ]);
        },
        (error) => {
          setError(error.message);
        }
      );

      return () => {
        window.navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError("Geolocation is not supported");
    }
  }, []);

  return (
    <div>
      {latitude && longitude && (
        <p>
          Latitude: {latitude}, Longitude: {longitude}
        </p>
      )}
      {error && <p>Error: {error}</p>}
      <h3>Location Log:</h3>
      <ul>
        {locationLog.map((location, index) => (
          <li key={index}>
            Latitude: {location.latitude}, Longitude: {location.longitude} -{" "}
            {location.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Geolocation;
