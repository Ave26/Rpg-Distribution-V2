import { useState, useEffect } from "react";
import Geolocation from "@/components/Geolocation";

const DeliveryManagementPage = () => {
  const [showGeolocation, setShowGeolocation] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const handleShowGeolocation = () => {
    setShowGeolocation(true);
    setUpdateCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (showGeolocation) {
      setUpdateCount((prevCount) => prevCount + 1);
    }
  }, [showGeolocation]);

  return (
    <div>
      <h1>Delivery Management</h1>
      <button onClick={handleShowGeolocation}>Show Geolocation</button>

      {showGeolocation && (
        <div>
          <h2>Geolocation Component:</h2>
          {/* Render the Geolocation component here */}
          <Geolocation key={updateCount} />
        </div>
      )}
    </div>
  );
};

export default DeliveryManagementPage;
