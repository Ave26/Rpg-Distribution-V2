import DashboardLayout from "@/components/Admin/dashboardLayout";
import BinInventory from "@/components/Inventory/BinInventory";
import DamageInventory from "@/components/Inventory/DamageInventory";
import ProductInventory from "@/components/Inventory/ProductInventory";
import Layout from "@/components/layout";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { buttonStyle, buttonStyleEdge } from "@/styles/style";
import { ReactElement, useState } from "react";

export type ButtonState = "Bin" | "Product" | "Damage Bin";
export type DeliveryState =
  | "Truck Management"
  | "View Truck Loads"
  | "Manage Location";

export default function InventoryManageMent() {
  // const [selected, setSelected] = useState<ButtonState>("Bin");
  const { states } = useMyContext();

  const componentMapping: Record<ButtonState, JSX.Element> = {
    Bin: <BinInventory />,
    Product: <ProductInventory />, // <BinInventory /> <BinInventorySkwak />
    "Damage Bin": <DamageInventory />,
  };

  const renderSelectedComponent =
    componentMapping[states?.inventoryAction ?? "Bin"];
  return (
    <section className="flex h-full flex-col overflow-scroll overflow-x-hidden px-1">
      {renderSelectedComponent}
    </section>
  );
}

{
  /* <div className="flex min-w-fit max-w-md gap-2 p-2">
        <ButtonState
          selected={states?.inventoryAction ?? "Bin"}
          componentMapping={componentMapping}
          setSelected={states?.setInventoryAction}
        />
      </div> */
}

interface ButtonStateProps {
  selected: string;
  setSelected?: React.Dispatch<React.SetStateAction<ButtonState>>;
  componentMapping: Record<ButtonState, JSX.Element>;
}

function ButtonState({
  selected,
  componentMapping,
  setSelected,
}: ButtonStateProps) {
  return (
    <>
      {Object.keys(componentMapping).map((v) => {
        return (
          <button
            key={v}
            className={`${buttonStyleEdge} ${
              v === selected && "bg-[#86B6F6]"
            } w-full`}
            onClick={() => {
              setSelected && setSelected(v as "Bin" | "Product");
            }}
          >
            {v}
          </button>
        );
      })}
    </>
  );
}

InventoryManageMent.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
