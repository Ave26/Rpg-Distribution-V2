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
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (isTracking && typeof window !== "undefined" && "geolocation" in window.navigator) {
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
    }
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const mapUrl = `https://maps.google.com/maps?q=${latitude || 0},${longitude || 0}&output=embed`;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Geolocation Map</h1>
        <div className="h-64 mt-4">
          {latitude && longitude ? (
            <iframe
              title="Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={mapUrl}
              allowFullScreen
            ></iframe>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>

      {latitude && longitude && (
        <p className="mb-4">
          Latitude: {latitude}, Longitude: {longitude}
        </p>
      )}
      {error && <p className="mb-4 text-red-500">Error: {error}</p>}
      <h3 className="mb-2 text-lg font-bold">Location Log:</h3>
      <ul className="mb-4">
        {locationLog.map((location, index) => (
          <li key={index} className="mb-1">
            Latitude: {location.latitude}, Longitude: {location.longitude} - {location.timestamp}
          </li>
        ))}
      </ul>

      {!isTracking ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startTracking}
        >
          Start Tracking
        </button>
      ) : (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={stopTracking}
        >
          Stop Tracking
        </button>
      )}
    </div>
  );
};

export default Geolocation;
