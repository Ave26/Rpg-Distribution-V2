// components/Inventory/BinTable.js
import React from "react";
import { TBins } from "../InventoryTypes";
import { DamageProductInfo } from "../BinInventorySkwak";

type TBinTableProps = {
  bins: TBins[] | undefined;
  states: States;
};

type States = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moveDamageBin: boolean;
  setMoveDamageBin: React.Dispatch<React.SetStateAction<boolean>>;
  damageProduct: DamageProductInfo;
  setDamageProduct: React.Dispatch<React.SetStateAction<DamageProductInfo>>;
};

const BinTable = ({ bins, states }: TBinTableProps) => {
  const {
    moveDamageBin,
    open,
    setMoveDamageBin,
    setOpen,
    damageProduct,
    setDamageProduct,
  } = states;
  const thArray = [
    "Category",
    "BinName",
    "SKUCode",
    "Barcode Id",
    "Product Name",
    "Purchase Order",
    "Expiration Date",
    "Receive Date",
    "Quality",
    "Status",
    "Quantity",
  ];

  return (
    <table className="min-w-full text-center text-sm font-light">
      <thead className="sticky border-b bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
        <tr>
          {thArray.map((th, index) => {
            return <th key={index}>{th}</th>;
          })}
        </tr>
      </thead>

      <tbody>
        {bins?.map((bin: TBins) => {
          return (
            <tr key={bin.id}>
              <td className="text-end">{bin.racks.categories.category}</td>
              <td className="text-center">
                {bin.racks.name}
                {bin.row} - {bin.shelfLevel}
              </td>
              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <h1 key={assignedProduct.id}>{assignedProduct.skuCode}</h1>
                  ))[0]
                }
              </td>

              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <h1 key={assignedProduct.id}>
                      {assignedProduct.barcodeId}
                    </h1>
                  ))[0]
                }
              </td>

              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <h1 key={assignedProduct.id}>
                      {assignedProduct.products?.productName}
                    </h1>
                  ))[0]
                }
              </td>

              <td>
                <select
                  name=""
                  id=""
                  className="w-24 appearance-none border border-black text-center"
                >
                  {bin.assignedProducts.map((assignedProduct, index) => (
                    <option key={index}>{assignedProduct.purchaseOrder}</option>
                  ))}
                </select>
              </td>

              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <p key={assignedProduct.id}>
                      {String(assignedProduct?.expirationDate).split("T")[0]}
                    </p>
                  ))[0]
                }
              </td>
              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <p key={assignedProduct.id}>
                      {String(assignedProduct?.dateReceived).split("T")[0]}
                    </p>
                  ))[0]
                }
              </td>

              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <p key={assignedProduct.id}>{assignedProduct.quality}</p>
                  ))[0]
                }
              </td>

              <td>
                {
                  bin.assignedProducts.map((assignedProduct) => (
                    <p key={assignedProduct.id}>{assignedProduct.status}</p>
                  ))[0]
                }
              </td>
              <td>{bin._count.assignedProducts}</td>
              <td className={`${moveDamageBin ? "animate-emerge" : "hidden"}`}>
                <button
                  type="button"
                  className={`rounded-sm bg-sky-300/40 p-2 text-xs font-bold uppercase shadow-md hover:bg-sky-300/80 active:bg-sky-300`}
                  id="printInventory"
                  onClick={() => {
                    console.log("move damaged product");
                    setOpen(true);
                    setDamageProduct({ ...damageProduct, binId: bin.id });
                  }}
                >
                  move damaged product
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BinTable;
