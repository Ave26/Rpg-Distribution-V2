import Layout from "@/components/layout";
import { useEffect, useState, useRef } from "react";

type LocationEntry = {
  latitude: number;
  longitude: number;
  timestamp: string;
  message?: string;
};

type PositionError = {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
};

const Geolocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationLog, setLocationLog] = useState<LocationEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);
  const [deliveryInitiated, setDeliveryInitiated] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      isTracking &&
      typeof window !== "undefined" &&
      "geolocation" in window.navigator
    ) {
      watchIdRef.current = window.navigator.geolocation.watchPosition(
        (position) => {
          const newLatitude = position.coords.latitude;
          const newLongitude = position.coords.longitude;

          setLatitude(newLatitude);
          setLongitude(newLongitude);

          if (!locationLog.length && !pathPoints.length) {
            setLocationLog((prevLog) => [
              ...prevLog,
              {
                latitude: newLatitude,
                longitude: newLongitude,
                timestamp: new Date().toISOString(),
                message: "Start Delivery has been initiated",
              },
            ]);

            setPathPoints((prevPoints) => [
              ...prevPoints,
              {
                x: newLongitude,
                y: newLatitude,
              },
            ]);

            setDeliveryInitiated(true);
          } else if (
            newLatitude !== null &&
            newLongitude !== null &&
            locationLog[0]?.message !== "Start Delivery has been initiated"
          ) {
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
          }
        },
        (error: PositionError) => {
          setError(error.message);
        }
      );
    }

    return () => {
      if (watchIdRef.current) {
        window.navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking]);

  const handleGasStop = () => {
    if (latitude && longitude) {
      setLocationLog((prevLog) => [
        ...prevLog,
        {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
          message: "Gas Stop",
        },
      ]);
    }
  };

  const handleEmergencyStop = () => {
    if (latitude && longitude) {
      setLocationLog((prevLog) => [
        ...prevLog,
        {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
          message: "Emergency Stop",
        },
      ]);
    }
  };

  const handleCompleteDelivery = () => {
    if (latitude && longitude) {
      setLocationLog((prevLog) => [
        ...prevLog,
        {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
          message: "Complete Delivery",
        },
      ]);
    }
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

        if (pathPoints.length >= 2) {
          ctx.beginPath();
          const startPoint = pathPoints[0];
          ctx.moveTo(startPoint.x, startPoint.y);

          pathPoints.slice(1).forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });

          ctx.stroke();
        }
      }
    }
  }, [pathPoints]);

  useEffect(() => {
    if (latitude && longitude && isTracking) {
      setPathPoints((prevPoints) => [
        ...prevPoints,
        {
          x: longitude,
          y: latitude,
        },
      ]);
    }
  }, [latitude, longitude, isTracking]);

  return (
    <Layout>
      <div className="container mx-auto mt-10 px-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Delivery Tracking</h1>
          {!isTracking ? (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => {
                setIsTracking(true);
                setLatitude(null);
                setLongitude(null);
                setLocationLog([]);
                setPathPoints([]);
              }}
            >
              Start Delivery
            </button>
          ) : (
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => {
                setIsTracking(false);
                setDeliveryInitiated(false);
                handleCompleteDelivery();
              }}
            >
              Complete Delivery
            </button>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Location Log:</h3>
          <ul className="border border-gray-300 p-4 h-[20em] overflow-y-scroll">
            {locationLog.map((location, index) => (
              <li key={index} className="mb-2">
                {location.message && (
                  <span
                    className={`font-bold ${
                      location.message === "Emergency Stop" ||
                      location.message === "Gas Stop"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {location.message}
                  </span>
                )}
                <span>
                  {`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
                </span>
                <br />
                <span>{`Timestamp: ${location.timestamp}`}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Map:</h3>
          {deliveryInitiated ? (
            <div className="relative h-72">
              <iframe
                title="Map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`}
                allowFullScreen
                style={{ zIndex: 0 }}
              ></iframe>
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 h-full w-full pointer-events-none"
              ></canvas>
            </div>
          ) : (
            <p>No delivery initiated yet.</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Actions:</h3>
          <div>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded mr-4"
              onClick={handleGasStop}
              disabled={!isTracking}
            >
              Gas Stop
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={handleEmergencyStop}
              disabled={!isTracking}
            >
              Emergency Stop
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Geolocation;
