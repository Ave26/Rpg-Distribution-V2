import React, { useState } from "react";
import { TProducts, TUpdateProductId } from "../InventoryTypes";
import { KeyedMutator } from "swr";

type ProductTableProps = {
  products: TProducts[] | undefined;
  updateProduct: TUpdateProductId;
  setUpdateProduct: React.Dispatch<React.SetStateAction<TUpdateProductId>>;
};

export default function ProductTable({
  products,
  updateProduct,
  setUpdateProduct,
}: ProductTableProps) {
  const thArray = [
    "Product Name",
    "Barcode Id",
    "Total Quantity",
    "SKU Code",
    "Threshold",
    "Price",
    "Status",
  ];

  return (
    <table
      aria-disabled={true}
      className="min-w-full text-center text-sm font-light">
      <thead className="border-black bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
        <tr>
          {thArray.map((th, index) => {
            return <th key={index}>{th}</th>;
          })}
          <th>title</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((product: TProducts) => {
          return (
            <tr key={product.id}>
              <td className="text-end">{product.productName}</td>
              <td className="">{product.barcodeId}</td>
              <td className="">{product._count.assignedProducts}</td>
              <td className="text-start">
                <select name="" id="">
                  {product.assignedProducts.map((assignedProduct) => (
                    <option key={assignedProduct.id}>
                      {assignedProduct.skuCode}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                {
                  product.assignedProducts.map((assignedProduct) => (
                    <h1 key={assignedProduct.id}>
                      {assignedProduct.sku?.threshold}
                    </h1>
                  ))[0]
                }
              </td>
              <td>{product.price}</td>
              <td>{product.discontinued}</td>
              <td
                className={`${
                  updateProduct.isOpen &&
                  updateProduct.id === product.id &&
                  "border border-black"
                } cursor-pointer rounded-sm text-[10px] font-bold uppercase text-blue-500`}
                onClick={() => {
                  setUpdateProduct({
                    id: product.id,
                    barcodeId: product.barcodeId,
                    isOpen: true,
                  });
                }}>
                Update
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
