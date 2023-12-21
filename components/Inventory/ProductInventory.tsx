import React, { useEffect, useState } from "react";
import ProductTable from "./InventoryParts/ProductTable";
import useSWR from "swr";
import { TProducts, TUpdateProductId, TSKU } from "./InventoryTypes";
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
  const [isOpen, setIsOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState<TUpdateProductId>({
    id: "",
    barcodeId: "",
    price: 0,
    productName: "",
  });

  const [SKU, setSKU] = useState<TSKU>({
    barcodeId: "",
    code: "",
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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        SKU={SKU}
        setSKU={setSKU}
      />

      {isOpen && (
        <ProductToBeUpdate
          updateProduct={updateProduct}
          setUpdateProduct={setUpdateProduct}
          SKU={SKU}
          setSKU={setSKU}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mutate={mutate}
        />
      )}
    </section>
  );
}
