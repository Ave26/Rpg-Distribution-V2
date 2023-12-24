import React, { useEffect, useMemo, useState } from "react";
import { TProducts, TUpdateProductId } from "../InventoryTypes";
import { KeyedMutator } from "swr";
import { TSKU } from "../InventoryTypes";

type ProductTableProps = {
  products: TProducts[] | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateProduct: TUpdateProductId;
  setUpdateProduct: React.Dispatch<React.SetStateAction<TUpdateProductId>>;
  SKU: TSKU;
  setSKU: React.Dispatch<React.SetStateAction<TSKU>>;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProductTable({
  products,
  updateProduct,
  setUpdateProduct,
  isOpen,
  setIsOpen,
  SKU,
  setSKU,
}: ProductTableProps) {
  const thArray = [
    "Product Name",
    "Barcode Id",
    "Total Quantity",
    "SKU Code",
    "Threshold",
    "Price",
    "Status",
    "Weight",
  ];

  const initialSKUs: Record<string, string> = {};
  products?.forEach((product) => {
    initialSKUs[product.id] = product.sku[0]?.code || "";
  });

  return (
    <table className="min-w-full text-center text-sm  font-bold">
      <thead className="border-black bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
        <tr>
          {thArray.map((th, index) => {
            return <th key={index}>{th}</th>;
          })}
          <th>Update</th>
        </tr>
      </thead>
      <tbody className="relative">
        {products?.map((product: TProducts) => {
          return (
            <tr key={product.id} className="border border-black text-center">
              <td className="text-center">{product.productName}</td>
              <td className="text-center">{product.barcodeId}</td>
              <td className="text-center">{product._count.assignedProducts}</td>
              <td className="text-center">
                <select
                  name="skuCode"
                  id=""
                  value={SKU.code} // SKU.code || getSKUCode(product.sku[0].code)
                  onChange={(e) => {
                    setSKU((prevState) => ({
                      ...prevState,
                      code: e.target.value,
                    }));
                  }}>
                  <option defaultValue={"Please Select"}></option>;
                  {product.sku.map((value) => {
                    return <option key={value.id}>{value.code}</option>;
                  })}
                </select>
              </td>

              <td>
                {product.sku.map((value) => {
                  return (
                    <p key={value.id}>
                      {SKU.code === value.code && value.threshold}
                    </p>
                  );
                })}
              </td>
              <td>{product.price}</td>
              <td>{String(product.discontinued)}</td>
              <td>
                {product.sku.map((value) => {
                  return (
                    <p key={value.id}>
                      {SKU.code === value.code && value.weight}
                    </p>
                  );
                })}
              </td>

              <td
                className={`${
                  isOpen &&
                  updateProduct.id === product.id &&
                  "border border-black"
                } cursor-pointer rounded-sm text-[10px] font-bold uppercase text-blue-500`}
                onClick={() => {
                  setUpdateProduct({
                    ...updateProduct,
                    id: product.id,
                    barcodeId: product.barcodeId,
                  });
                  setSKU((prevState) => ({
                    ...prevState,
                    barcodeId: product.barcodeId,
                  }));
                  setIsOpen(true);
                }}>
                Update
              </td>
            </tr>
            /* <div
                className={`${
                  isOpen ? "h-0 border-none" : "h-[7em]"
                } absolute w-full border border-black`}></div> */
          );
        })}
      </tbody>
    </table>
  );
}
