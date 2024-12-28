import DashboardLayout from "@/components/Admin/dashboardLayout";
import BinInventory from "@/components/Inventory/BinInventory";
import DamageInventory from "@/components/Inventory/DamageInventory";
import ProductInventory from "@/components/Inventory/ProductInventory";
import Layout from "@/components/layout";
import { buttonStyle, buttonStyleEdge } from "@/styles/style";
import { ReactElement, useState } from "react";

type ButtonState = "Bin" | "Product" | "Damage Bin";

interface ButtonStateProps {
  selected: string;
  componentMapping: Record<ButtonState, JSX.Element>;
  setSelected: React.Dispatch<React.SetStateAction<ButtonState>>;
}

export default function InventoryManageMent() {
  const [selected, setSelected] = useState<ButtonState>("Bin");
  const componentMapping: Record<ButtonState, JSX.Element> = {
    Bin: <BinInventory />,
    Product: <ProductInventory />, // <BinInventory /> <BinInventorySkwak />
    "Damage Bin": <DamageInventory />,
    // "Button Skwak": <BinInventorySkwak />,
  };

  const renderSelectedComponent = componentMapping[selected];
  return (
    <section className="flex h-full flex-col bg-white">
      <div className="flex min-w-fit max-w-md gap-2 p-2">
        <ButtonState
          selected={selected}
          componentMapping={componentMapping}
          setSelected={setSelected}
        />
      </div>
      <div className="h-full w-full bg-slate-700 py-2 md:px-12">
        {renderSelectedComponent}
      </div>
    </section>
  );
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
              setSelected(v as "Bin" | "Product");
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
