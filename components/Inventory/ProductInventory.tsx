import React, { useEffect, useState } from "react";
import ProductTable from "./InventoryParts/ProductTable";
import useSWR from "swr";
import { TProducts, TUpdateProductId } from "./InventoryTypes";
import ProductToBeUpdate from "./InventoryParts/ProductToBeUpdate";

async function fetcher(url: string): Promise<TProducts[]> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
}

export default function ProductInventory() {
  const [updateProduct, setUpdateProduct] = useState<TUpdateProductId>({
    id: "",
    barcodeId: "",
    isOpen: false,
    price: 0,
    productName: "",
    skuCode: "",
    threshold: 0,
    weight: 0,
  });

  const { data, mutate } = useSWR("/api/inventory/get-products", fetcher, {
    refreshInterval: 1200,
  });

  return (
    <section className="flex h-[30.5em] w-full items-start justify-center overflow-y-scroll border border-black">
      <ProductTable
        products={data}
        setUpdateProduct={setUpdateProduct}
        updateProduct={updateProduct}
      />

      {updateProduct.isOpen && (
        <ProductToBeUpdate
          updateProduct={updateProduct}
          setUpdateProduct={setUpdateProduct}
          mutate={mutate}
        />
      )}
    </section>
  );
}
