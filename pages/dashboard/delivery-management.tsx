import { useState } from "react";
import Geolocation from "@/components/Geolocation";

const DeliveryManagementPage = () => {
  const [showGeolocation, setShowGeolocation] = useState(false);

  const handleShowGeolocation = () => {
    setShowGeolocation(true);
  };

  return (
    <div>
      <h1>Delivery Management</h1>
      <button onClick={handleShowGeolocation}>Show Geolocation</button>

      {showGeolocation && (
        <div>
          <h2>Geolocation Component:</h2>
          <Geolocation />
        </div>
      )}
    </div>
  );
};

export default DeliveryManagementPage;
