import React, { useEffect, useState } from 'react';

const MapDisplay = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        error => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported');
    }
  }, []);

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24859.092586071023!2d${currentPosition.lng || 0}!3d${currentPosition.lat || 0}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDM4JzQzLjAiTiA3N8KwMjknMTIuMiJF!5e0!3m2!1sen!2sus!4v1621055880878!5m2!1sen!2sus`;

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <h1>Map Display</h1>
      {currentPosition.lat !== null && currentPosition.lng !== null ? (
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
  );
};

export default MapDisplay;
