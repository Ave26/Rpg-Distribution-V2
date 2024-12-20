import DashboardLayout from "@/components/Admin/dashboardLayout";
import DeliveryManagementButtonSelection from "@/components/DeliveryMangement/DeliveryManagementButtonSelection";
import TruckManagement from "@/components/DeliveryMangement/TruckManagement";
import ViewTruckLoads from "@/components/DeliveryMangement/ViewTruckLoads";
import { TSelectedBTN } from "@/components/DeliveryMangement/deliveryManagementTypes";
import Layout from "@/components/layout";
import { useMyContext } from "@/contexts/AuthenticationContext";
import React, { ReactElement, useEffect, useState } from "react";
import Location from "@/components/DeliveryMangement/Location/Location";
import { AiOutlineLoading } from "react-icons/ai";

export default function DeliveryManagement() {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.roles;

  const [selectedButton, setSelectedButton] = useState<TSelectedBTN>("Empty");

  const componentMapping: Record<TSelectedBTN, JSX.Element> = {
    "Truck Management": <TruckManagement />,
    "View Truck Loads": <ViewTruckLoads />,
    "Manage Location": <Location />,
    Empty: (
      <div className="flex h-full w-full items-center justify-center">
        <AiOutlineLoading className="animate-spin " size={30} />
      </div>
    ),
  };

  useEffect(() => {
    if (role === "Driver") setSelectedButton("View Truck Loads");
    if (role === "Admin" || role === "SuperAdmin")
      setSelectedButton("Truck Management");
  }, [role]);

  const renderComponent = componentMapping[selectedButton];
  return (
    <section className="flex h-full w-full flex-col items-start justify-start gap-2">
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
