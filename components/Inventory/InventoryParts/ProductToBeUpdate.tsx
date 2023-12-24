import React, { useEffect, useState } from "react";
import { TInput, TSKU, TToast, TUpdateProductId } from "../InventoryTypes";
import { RiCloseFill } from "react-icons/ri";
import InputWLabel from "./InputWLabel";
import Loading from "@/components/Parts/Loading";
import { products } from "@prisma/client";
import InventoryRequestButton from "./InventoryRequestButton";

type TProductToBeUpdate = {
  updateProduct: TUpdateProductId;
  setUpdateProduct: React.Dispatch<React.SetStateAction<TUpdateProductId>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  SKU: TSKU;
  setSKU: React.Dispatch<React.SetStateAction<TSKU>>;
  mutate: () => void;
  toast: TToast;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

type TData = {
  products: products;
  message: string;
};

function ProductToBeUpdate({
  updateProduct,
  setUpdateProduct,
  mutate,
  SKU,
  setSKU,
  isOpen,
  setIsOpen,
  setToast,
  toast,
  disabled,
  setDisabled,
}: TProductToBeUpdate) {
  const [loading, setLoading] = useState({
    product: false,
    sku: {
      update: false,
      alter: false,
    },
  });
  const [code, setCode] = useState("");
  const [swap, setSwap] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "skuCode") {
      setCode(value);
    } else if (name === "weight" || name === "threshold") {
      setSKU((prevState) => ({ ...prevState, [name]: parseInt(value) }));
    } else {
      setUpdateProduct((prevState) => ({
        ...prevState,
        [name]: name === "price" ? parseFloat(value) : value,
      }));
    }
  }

  return (
    <form
      className={`absolute translate-y-24 flex-col rounded-sm border border-black bg-white/20 p-2  shadow-lg backdrop-blur-lg transition-colors ${
        isOpen ? "animation-emerge" : "animation-fade"
      }`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setUpdateProduct({
            ...updateProduct,
            barcodeId: "",
            price: 0,
            productName: "",
          });
          setSKU((prevState) => ({
            ...prevState,
            barcodeId: "",
          }));

          setIsOpen(false);
        }}
        className="h-fit w-fit">
        <RiCloseFill className="text-slate-700 hover:text-sky-500" />
      </button>
      <h1 className="my-2 text-xs font-bold uppercase">
        Barcode Id: {updateProduct?.barcodeId}
      </h1>
      <div className="flex flex-col gap-2">
        <InputWLabel
          inputAttributes={{
            type: "text",
            name: "productName",
            id: "productName",
            value: String(updateProduct.productName),
            onChange: handleChange,
          }}
          lableAttributes={{
            children: "Product Name",
            htmlFor: "productName",
          }}
          customInputStyle="w-[20em]"
        />
        <InputWLabel
          inputAttributes={{
            type: "number",
            name: "price",
            id: "price",
            value: Number(updateProduct.price),
            onChange: handleChange,
          }}
          lableAttributes={{
            children: "Price",
            htmlFor: "price",
          }}
          customInputStyle="w-[20em]"
        />

        <div className="flex justify-between p-2 text-[10px] font-bold uppercase">
          <h1 className="flex items-center justify-center text-[20px]">
            For SKU
          </h1>
          <div className="">
            <button
              className="h-[40px] w-full rounded-sm bg-sky-300/40 p-2 text-xs font-bold uppercase shadow-md hover:bg-sky-300/80 active:bg-sky-300"
              type="button"
              onClick={async () => {
                setLoading({ ...loading, product: true });
                fetch("/api/inventory/set-product", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ updateProduct }),
                })
                  .then((res) => res.json())
                  .then(({ message }: TData) => {
                    console.log(message);
                    setLoading({ ...loading, product: false });
                    setToast({
                      ...toast,
                      show: true,
                      message: message,
                    });
                  })
                  .catch((error) => console.log(error))
                  .finally(() =>
                    setUpdateProduct((prevState) => ({
                      ...prevState,
                      productName: "",
                      price: 0,
                    }))
                  );
              }}>
              {loading.product ? <Loading /> : "Update Product"}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {swap ? (
            <div
              onDoubleClick={() => {
                setSwap(false);
                setDisabled(false);
              }}>
              <InputWLabel
                inputAttributes={{
                  type: "text",
                  name: "skuCode",
                  id: "skuCode",
                  value: code,
                  onChange: handleChange,
                }}
                lableAttributes={{
                  children: "SKU Code",
                  htmlFor: "skuCode",
                }}
                customInputStyle="w-[20em]"
              />
            </div>
          ) : (
            <div
              onDoubleClick={() => {
                setSwap(true);
                setDisabled(true);
              }}
              className="peer flex cursor-pointer select-none appearance-none items-center justify-between rounded-sm border border-black px-3 py-2 text-xs font-bold uppercase outline-none">
              <h1>{SKU.code}</h1>
              <p className="text-[10px] text-slate-500">
                double click to edit text
              </p>
            </div>
          )}

          <InputWLabel
            inputAttributes={{
              type: "number",
              min: 0,
              name: "threshold",
              id: "threshold",
              value: SKU.threshold,
              onChange: handleChange,
              onDoubleClick: () => {
                setSwap(false);
              },
            }}
            lableAttributes={{
              children: "Threshold",
              htmlFor: "threshold",
            }}
            customInputStyle="w-[20em]"
          />
          <InputWLabel
            inputAttributes={{
              type: "number",
              min: 0,
              name: "weight",
              id: "weight",
              value: Number(SKU.weight),
              onChange: handleChange,
            }}
            lableAttributes={{
              children: "Weight",
              htmlFor: "weight",
            }}
            customInputStyle="w-[20em]"
          />
        </div>
        <InventoryRequestButton
          states={{
            code,
            disabled,
            loading,
            mutate,
            setCode,
            setDisabled,
            setLoading,
            setSKU,
            setToast,
            SKU,
            toast,
          }}
        />
      </div>
    </form>
  );
}

export default ProductToBeUpdate;
