import { useEffect, useState } from "react"; 
 
export default function Geolocation() { 
  const [latitude, setLatitude] = useState<any>(null); 
  const [longitude, setLongitude] = useState<any>(null); 
  const [error, setError] = useState<any>(null); 
 
  useEffect(() => { 
    if (typeof window !== "undefined" && "geolocation" in window.navigator) { 
      window.navigator.geolocation.getCurrentPosition( 
        (position) => { 
          setLatitude(position.coords.latitude); 
          setLongitude(position.coords.longitude); 
        }, 
        (error) => { 
          setError(error.message); 
        } 
      ); 
    } else { 
      setError("Geolocation is not supported"); 
    } 
  }, []); 
 
  return ( 
    <div className="select-text"> 
      {latitude && longitude && ( 
        <p> 
          Latitude: {latitude}, Longitude: {longitude} 
        </p> 
      )} 
      {error && <p>Error: {error}</p>} 
    </div> 
  ); 
}