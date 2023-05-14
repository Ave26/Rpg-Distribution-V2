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
      <button className="text-gray-900 hover:text-white border h-full w-full border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" onClick={handleShowGeolocation}>Show Geolocation</button>

      {showGeolocation && (
        <div>
          <h2>Geolocation Component:</h2>
          <Geolocation/>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagementPage;
