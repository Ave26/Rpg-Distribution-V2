import React, { useEffect, useState } from "react";
import { TInput, TUpdateProductId } from "../InventoryTypes";
import { RiCloseFill } from "react-icons/ri";
import InputWLabel from "./InputWLabel";
import Loading from "@/components/Parts/Loading";

type TProductToBeUpdate = {
  updateProduct: TUpdateProductId;
  setUpdateProduct: React.Dispatch<React.SetStateAction<TUpdateProductId>>;
  mutate: () => void;
};

function ProductToBeUpdate({
  updateProduct,
  setUpdateProduct,
  mutate,
}: TProductToBeUpdate) {
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setUpdateProduct((prevUpdateProduct) => ({
      ...prevUpdateProduct,
      [name]:
        name === "weight" || name === "price" || name === "threshold"
          ? parseInt(value)
          : value,
    }));
  }
  console.log(updateProduct);
  function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    fetch("/api/inventory/set-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updateProduct }),
    })
      .then((res) => res.json())
      .then((data) => data && mutate())
      .catch((error) => error)
      .finally(() => {
        setIsLoading(false);

        if (!isLoading) {
          setUpdateProduct((prevState) => {
            return { ...prevState, isOpen: false, productName: "", price: 0 };
          });
        }
      });
  }

  const btnStyle =
    "rounded-sm bg-sky-300/40 p-2 shadow-md hover:bg-sky-300/80 active:bg-sky-300 uppercase text-xs font-bold w-full";
  return (
    <form
      className={`absolute translate-y-24 flex-col rounded-sm border border-black bg-white/20 p-2  shadow-lg backdrop-blur-lg transition-colors ${
        updateProduct.isOpen ? "animation-emerge" : "animation-fade"
      }`}
      onSubmit={handleSubmit}>
      <button
        onClick={() =>
          setUpdateProduct({
            ...updateProduct,
            isOpen: false,
            barcodeId: "",
            price: 0,
            productName: "",
            skuCode: "",
            threshold: 0,
            weight: 0,
          })
        }
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
            value: updateProduct.price,
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
            <button className={btnStyle} type="button">
              Update
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <InputWLabel
            inputAttributes={{
              type: "text",
              name: "skuCode",
              id: "skuCode",
              value: String(updateProduct.skuCode),
              onChange: handleChange,
            }}
            lableAttributes={{
              children: "SKU Code",
              htmlFor: "skuCode",
            }}
            customInputStyle="w-[20em]"
          />

          <InputWLabel
            inputAttributes={{
              type: "number",
              min: 0,
              name: "threshold",
              id: "threshold",
              value: updateProduct.threshold,
              onChange: handleChange,
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
              value: Number(updateProduct.weight),
              onChange: handleChange,
            }}
            lableAttributes={{
              children: "Weight",
              htmlFor: "weight",
            }}
            customInputStyle="w-[20em]"
          />
        </div>
        <div className="flex flex-row gap-2">
          <button className={`${btnStyle}`} type="submit">
            {isLoading ? <Loading /> : "Enter"}
          </button>
          <button className={`${btnStyle}`} type="submit">
            {isLoading ? <Loading /> : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProductToBeUpdate;
