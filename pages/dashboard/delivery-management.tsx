import DashboardLayout from "@/components/Admin/dashboardLayout";
import DeliveryManagementButtonSelection from "@/components/DeliveryMangement/DeliveryManagementButtonSelection";
import TruckManagement from "@/components/DeliveryMangement/TruckManagement";
import ViewTruckLoads from "@/components/DeliveryMangement/ViewTruckLoads";
import { TSelectedBTN } from "@/components/DeliveryMangement/deliveryManagementTypes";
import Layout from "@/components/layout";
import React, { ReactElement, useState } from "react";

export default function DeliveryManagement() {
  const [selectedButton, setSelectedButton] =
    useState<TSelectedBTN>("Truck Management");

  
  const componentMapping = {
    "Truck Management": <TruckManagement />,
    "View Truck Loads": <ViewTruckLoads />,
  };

  const renderComponent = componentMapping[selectedButton];

  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-3">
      <DeliveryManagementButtonSelection
        states={{
          selectedButton,
          setSelectedButton
        }}
      />
      {renderComponent}
    </section>
  );
}

DeliveryManagement.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
