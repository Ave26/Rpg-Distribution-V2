import DashboardLayout from "@/components/Admin/dashboardLayout";
import DeliveryManagementButtonSelection from "@/components/DeliveryMangement/DeliveryManagementButtonSelection";
import TruckManagement from "@/components/DeliveryMangement/TruckManagement";
import ViewTruckLoads from "@/components/DeliveryMangement/ViewTruckLoads";
import { TSelectedBTN } from "@/components/DeliveryMangement/deliveryManagementTypes";
import Layout from "@/components/layout";
import { useMyContext } from "@/contexts/AuthenticationContext";
import React, { ReactElement, useState } from "react";

export default function DeliveryManagement() {
  const { globalState } = useMyContext();
  const role: string | undefined =
    globalState?.verifiedToken?.roles ?? "Driver";

  const [selectedButton, setSelectedButton] = useState<TSelectedBTN>(
    role === "Driver" ? "View Truck Loads" : "Truck Management"
  );

  const componentMapping = {
    "Truck Management": role === "Driver" || <TruckManagement />,
    "View Truck Loads": <ViewTruckLoads />,
  };

  const renderComponent = componentMapping[selectedButton];

  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-3">
      <DeliveryManagementButtonSelection
        role={role}
        states={{
          selectedButton,
          setSelectedButton,
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
