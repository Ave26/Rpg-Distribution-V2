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
    if (role === "DRIVER") setSelectedButton("View Truck Loads");
    if (role === "ADMIN" || role === "SUPERADMIN")
      setSelectedButton("Truck Management");
  }, [role]);

  const renderComponent =
    componentMapping[states?.deliveryAction ?? "Truck Management"];

  /* flex h-full w-full flex-col items-start justify-start gap-2 */

  {
    /* <div className="flex min-h-[9.2%] w-full justify-start gap-2 bg-white p-2 sm:h-[11.5%] lg:h-[12.5%]">
        <DeliveryManagementButtonSelection
          role={role}
          states={{
            selectedButton,
            setSelectedButton,
          }}
        />
      </div> */
  }
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
