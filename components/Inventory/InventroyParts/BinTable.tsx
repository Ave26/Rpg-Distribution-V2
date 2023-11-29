// components/Inventory/BinTable.js
import React from "react";
import { TBins } from "../InventoryTypes";

type TBinTableProps = {
  bins: TBins[] | undefined;
};

const BinTable = ({ bins }: TBinTableProps) => {
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
      <thead className="border-b bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
        <tr>
          {thArray.map((th, index) => {
            return <th key={index}>{th}</th>;
          })}
        </tr>
      </thead>
      {/* z */}

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
                  className="w-24 appearance-none border border-black text-center">
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
                      {String(assignedProduct?.dateReceive).split("T")[0]}
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BinTable;
