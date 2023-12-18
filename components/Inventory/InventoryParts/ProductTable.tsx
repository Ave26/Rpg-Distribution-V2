import React, { useEffect, useState } from "react";
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

  // Generate initial SKU mapping based on the products array
  const initialSKUs: Record<string, string> = {};
  products?.forEach((product) => {
    initialSKUs[product.id] = product.sku[0]?.code || "";
  });

  // State to track selected SKU for each product
  const [selectedSKUs, setSelectedSKUs] =
    useState<Record<string, string>>(initialSKUs);

  function handleChange(
    productId: string,
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const { value } = e.target;
    console.log(productId);
    setSelectedSKUs((prevSelectedSKUs) => ({
      ...prevSelectedSKUs,
      [productId]: value,
    }));
    setUpdateProduct((prevState) => ({
      ...prevState,
      skuCode: value,
    }));
  }

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
                  value={selectedSKUs[product.id] || product.sku[0]?.code}
                  onChange={(e) => handleChange(product.id, e)}>
                  {product.sku.map((value) => {
                    return <option key={value.id}>{value.code}</option>;
                  })}
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
              <td>{String(product.discontinued)}</td>
              <td
                className={`${
                  updateProduct.isOpen &&
                  updateProduct.id === product.id &&
                  "border border-black"
                } cursor-pointer rounded-sm text-[10px] font-bold uppercase text-blue-500`}
                onClick={() => {
                  setUpdateProduct({
                    ...updateProduct,
                    id: product.id,
                    barcodeId: product.barcodeId,
                    isOpen: true,
                    skuCode: selectedSKUs[product.id],
                  });
                  console.log("Selected SKU:", selectedSKUs[product.id]); // undefined
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
