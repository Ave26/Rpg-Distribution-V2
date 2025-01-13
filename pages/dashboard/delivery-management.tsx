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

  const renderComponent = componentMapping[selectedButton];

  /* flex h-full w-full flex-col items-start justify-start gap-2 */
  return (
    <section className="h-full w-full bg-slate-300">
      <div className="flex min-h-[9.2%] w-full justify-start gap-2 bg-white p-2 sm:h-[11.5%] lg:h-[12.5%]">
        <DeliveryManagementButtonSelection
          role={role}
          states={{
            selectedButton,
            setSelectedButton,
          }}
        />
      </div>
      <div className="flex max-h-[90.8%] flex-col gap-2 p-2 sm:h-[88.5%] sm:flex-row lg:h-[87.5%]">
        {renderComponent}
      </div>
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
