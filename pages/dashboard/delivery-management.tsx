import { useEffect, useState, useRef  } from "react";

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
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (isTracking && typeof window !== "undefined" && "geolocation" in window.navigator) {
      const watchId = window.navigator.geolocation.watchPosition(
        (position) => {
          const newLatitude = position.coords.latitude;
          const newLongitude = position.coords.longitude;

          setLatitude(newLatitude);
          setLongitude(newLongitude);

          setLocationLog((prevLog) => [
            ...prevLog,
            {
              latitude: newLatitude,
              longitude: newLongitude,
              timestamp: new Date().toISOString(),
            },
          ]);

          setPathPoints((prevPoints) => [
            ...prevPoints,
            {
              x: newLongitude,
              y: newLatitude,
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        ctx.beginPath();

        pathPoints.forEach((point, index) => {
          const x = (point.x - (longitude || 0)) * 1000 + canvas.width / 2;
          const y = -((point.y - (latitude || 0)) * 1000) + canvas.height / 2;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
      }
    }
  }, [pathPoints, latitude, longitude]);

  const mapUrl = `https://maps.google.com/maps?q=${latitude || 0},${longitude || 0}&output=embed`;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Geolocation Map</h1>
        <div className="h-64 mt-4">
          {latitude && longitude ? (
            <>
              <iframe
                title="Map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={mapUrl}
                allowFullScreen
              ></iframe>
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                style={{ zIndex: 1 }}
              ></canvas>
            </>
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
