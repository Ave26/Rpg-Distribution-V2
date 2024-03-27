import DashboardLayout from "@/components/Admin/dashboardLayout";
import DeliveryManagementButtonSelection from "@/components/DeliveryMangement/DeliveryManagementButtonSelection";
import TruckManagement from "@/components/DeliveryMangement/TruckManagement";
import ViewTruckLoads from "@/components/DeliveryMangement/ViewTruckLoads";
import { TSelectedBTN } from "@/components/DeliveryMangement/deliveryManagementTypes";
import Layout from "@/components/layout";
import { useMyContext } from "@/contexts/AuthenticationContext";
import React, { ReactElement, useEffect, useState } from "react";
import Location from "@/components/DeliveryMangement/Location/index";

export default function DeliveryManagement() {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.roles;

  const [selectedButton, setSelectedButton] =
    useState<TSelectedBTN>("Truck Management");

  const componentMapping: Record<TSelectedBTN, JSX.Element> = {
    "Truck Management": <TruckManagement />,
    "View Truck Loads": <ViewTruckLoads />,
    "Manage Location": <Location />,
  };

  useEffect(() => {
    if (role === "Driver") setSelectedButton("View Truck Loads");
  }, [role]);

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
