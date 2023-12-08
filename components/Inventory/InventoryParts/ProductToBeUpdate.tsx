import React, { useState } from "react";
import { TInput, TUpdateProductId } from "../InventoryTypes";
import { RiCloseFill } from "react-icons/ri";
import InputWLabel from "./InputWLabel";

type TProductToBeUpdate = {
  updateProduct: TUpdateProductId;
  setUpdateProduct: React.Dispatch<React.SetStateAction<TUpdateProductId>>;
};

function ProductToBeUpdate({
  updateProduct,
  setUpdateProduct,
}: TProductToBeUpdate) {
  // const [input, setInput] = useState<TInput>({
  //   id: "",
  //   price: 0,
  //   productName: "",
  //   skuCode: "",
  //   threshold: 0,
  //   weight: 0,
  // });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setUpdateProduct((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  function handleSubmit(e: React.MouseEvent<HTMLFormElement>) {
    e.preventDefault();

    fetch("/api/inventory/set-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => error);
  }
  const btnStyle =
    "rounded-sm bg-sky-300/40 p-2 shadow-md hover:bg-sky-300/80 active:bg-sky-300 uppercase text-xs font-bold w-full";
  return (
    <form
      className={`absolute flex translate-y-24 flex-col rounded-sm border border-black bg-white/20 p-2  shadow-lg backdrop-blur-lg transition-colors ${
        updateProduct.isOpen ? "animation-emerge" : "animation-fade"
      }`}
      onSubmit={handleSubmit}>
      a
      <button
        onClick={() =>
          setUpdateProduct({
            ...updateProduct,
            isOpen: false,
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
        />
        <InputWLabel
          inputAttributes={{
            type: "number",
            name: "price",
            id: "price",
            value: String(updateProduct.price),
            onChange: handleChange,
          }}
          lableAttributes={{
            children: "Price",
            htmlFor: "price",
          }}
        />
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
        />
        <InputWLabel
          inputAttributes={{
            type: "number",
            min: 0,
            name: "threshold",
            id: "threshold",
            value: String(updateProduct.threshold),
            onChange: handleChange,
          }}
          lableAttributes={{
            children: "Threshold",
            htmlFor: "threshold",
          }}
        />
        <InputWLabel
          inputAttributes={{
            type: "number",
            min: 0,
            name: "weight",
            id: "weight",
            value: String(updateProduct.weight),
            onChange: handleChange,
          }}
          lableAttributes={{
            children: "Weight",
            htmlFor: "weight",
          }}
        />
        <button className={`${btnStyle}`} type="submit">
          Enter
        </button>
      </div>
    </form>
  );
}

export default ProductToBeUpdate;
