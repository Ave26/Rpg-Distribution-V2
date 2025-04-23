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
  const { globalState, states } = useMyContext();
  const role = globalState?.verifiedToken?.role;
  console.log(role);
  // const [selectedButton, setSelectedButton] = useState<TSelectedBTN>("Empty");

  useEffect(() => {
    if (role) {
      states?.setDeliveryAction(
        role === "DRIVER" ? "View Truck Loads" : "Truck Management"
      );
    }
  }, [role]);

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

  const renderComponent =
    componentMapping[states?.deliveryAction ?? "Truck Management"];

  return (
    <>
      <section className="flex  flex-col gap-2 overflow-x-hidden overflow-y-scroll p-2">
        {renderComponent}
      </section>
    </>
  );
}

DeliveryManagement.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
