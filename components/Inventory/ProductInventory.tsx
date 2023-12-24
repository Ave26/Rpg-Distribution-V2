import React, { useEffect, useState } from "react";
import ProductTable from "./InventoryParts/ProductTable";
import useSWR from "swr";
import { TProducts, TUpdateProductId, TSKU, TToast } from "./InventoryTypes";
import ProductToBeUpdate from "./InventoryParts/ProductToBeUpdate";
import Toast from "../Parts/Toast";

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
  const [disabled, setDisabled] = useState(false);
  const [toast, setToast] = useState<TToast>({
    message: "",
    show: false,
  });

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.show]);

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
        disabled={disabled}
        setDisabled={setDisabled}
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
          setToast={setToast}
          toast={toast}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      )}

      <Toast data={toast.message} isShow={toast.show} />
    </section>
  );
}
