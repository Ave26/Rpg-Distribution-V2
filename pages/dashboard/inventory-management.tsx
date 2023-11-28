import DashboardLayout from "@/components/Admin/dashboardLayout";
import BinInventory from "@/components/Inventory/BinInventory";
import ProductInventory from "@/components/Inventory/ProductInventory";
import Layout from "@/components/layout";
import { ReactElement, useState } from "react";

export default function InventoryManageMent() {
  const [selected, setSelected] = useState<"Bin" | "Product">("Bin");

  const componentMapping = {
    Bin: <BinInventory />,
    Product: <ProductInventory />,
  };

  const renderSelectedComponent = componentMapping[selected];
  const btnStyle =
    "rounded-sm bg-sky-300/40 p-2 shadow-md hover:bg-sky-300/10 active:bg-sky-300 uppercase text-xs font-bold";
  return (
    <section>
      <div className="flex gap-2 border border-black p-2">
        <button
          className={`rounded-sm  ${
            selected === "Bin"
              ? "bg-sky-400/40 ring-2 ring-cyan-600"
              : "bg-sky-300/40"
          } p-2 text-xs font-bold uppercase shadow-md hover:bg-sky-300/10 active:bg-sky-300`}
          onClick={() => setSelected("Bin")}>
          Bin Inventory
        </button>
        <button
          className={`rounded-sm  ${
            selected === "Product"
              ? "bg-sky-400/40 ring-2 ring-cyan-600"
              : "bg-sky-300/40"
          } p-2 text-xs font-bold uppercase shadow-md hover:bg-sky-300/10 active:bg-sky-300`}
          onClick={() => setSelected("Product")}>
          Product Inventory
        </button>
      </div>

      {renderSelectedComponent}
    </section>
  );
}

InventoryManageMent.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
