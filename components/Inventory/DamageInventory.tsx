import useAssignedProducts from "@/hooks/useAssignedProducts";
import { FaProductHunt } from "react-icons/fa6";

import { DamageBins } from "@/pages/api/inventory/assigned-products/find";
import React, { useState } from "react";
import { buttonStyleSubmit } from "@/styles/style";

type ViewDamageBinsProps = {
  damageBin: DamageBins;
};

export default function DamageInventory() {
  const { assignedProducts } = useAssignedProducts();
  console.log(assignedProducts);
  const [select, setSelect] = useState("");

  // if the array includes same sku then merge
  // check if thesame sku and damageBinsId then display only the one

  return (
    <>
      <div className="flex h-[8%] rounded-t-md  bg-white p-2">
        <FaProductHunt
          size={30}
          className="flex h-full items-center justify-center drop-shadow-md"
        />
      </div>
      <div className="flex h-[45em] w-full flex-col items-center justify-start gap-2 overflow-y-scroll rounded-b-md  bg-slate-300 p-4">
        {Array.isArray(assignedProducts) &&
          assignedProducts?.map((product) => {
            return (
              <>
                <button
                  className="flex h-[4em] w-[45em] select-none flex-col items-center justify-center rounded-md border bg-white p-2 shadow-md hover:bg-sky-300"
                  onClick={() => {
                    if (select === product.skuCode) {
                      setSelect("");
                    } else {
                      setSelect(product.skuCode);
                    }
                  }}
                >
                  <h1>{product.skuCode}</h1>
                </button>
                <div
                  className={`${
                    select === product.skuCode
                      ? "h-[30em] p-2"
                      : "h-0 border-hidden"
                  }  flex w-[45em] flex-col gap-2 overflow-scroll border bg-slate-600 shadow-md transition-all`}
                >
                  {Array.isArray(product.damageBins) &&
                    product.damageBins.map((damageBin) => {
                      return (
                        <div
                          className="rouned-md flex h-20 w-full gap-2 border border-black bg-white p-2"
                          key={damageBin.id}
                        >
                          <ViewDamageBins
                            damageBin={damageBin}
                            key={damageBin.id}
                          />
                        </div>
                      );
                    })}
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}

function ViewDamageBins({ damageBin }: ViewDamageBinsProps) {
  return (
    <>
      <h1>Type: {damageBin.category}</h1>
      <h1 className="flex-shrink break-words">Id: {damageBin.id}</h1>
      <h1>Quantity: {damageBin.count}</h1>
      <h1>Purchase Order: {damageBin.PO}</h1>
      <h1>Supplier Name: {damageBin.supplierName}</h1>
      <button className={`${buttonStyleSubmit} scale-75`}>Action</button>
    </>
  );
}
