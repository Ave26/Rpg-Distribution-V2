import PalleteLocation from "@/pages/dashboard/pallete-location";
import React, { useState } from "react";

export default function RecieveProduct() {
  const [barcodeid, setBarcodeId] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [poId, setPoId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [palletteLoc, setPalletteLoc] = useState<string>("");

  const inputStyle =
    "rounded-md px-5 focus:ring-4 focus:outline-none border-2 md:w-full text-lg";
  // flex flex-col items-center justify-center gap-2
  return (
    <form className="h-full w-full rounded-lg shadow-xl grid grid-cols-3 grid-flow-row gap-5 p-7">
      <input
        placeholder="barcode"
        type="text"
        name=""
        id=""
        value={barcodeid}
        onChange={(e) => setBarcodeId(e.target.value)}
        className={inputStyle}
        autoFocus
      />
      <input
        placeholder="img"
        type="text"
        name=""
        id=""
        value={img}
        onChange={(e) => setImg(e.target.value)}
        className={inputStyle}
      />
      <input
        placeholder="description"
        type="text"
        name=""
        id=""
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputStyle}
      />
      <input
        placeholder="productName"
        type="text"
        name=""
        id=""
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className={inputStyle}
      />
      <input
        placeholder="price"
        type="text"
        name=""
        id=""
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className={inputStyle}
      />
      <input
        placeholder="sku"
        type="text"
        name=""
        id=""
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        className={inputStyle}
      />
      <input
        placeholder="poId"
        type="text"
        name=""
        id=""
        value={poId}
        onChange={(e) => setPoId(e.target.value)}
        className={inputStyle}
      />

      {/* <input
        type="text"
        name=""
        id=""
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={inputStyle}
          />
           */}
      {/* 
          <option>
              


      </option> */}

      <input
        type="text"
        name=""
        id=""
        value={palletteLoc}
        onChange={(e) => setPalletteLoc(e.target.value)}
        className={inputStyle}
      />

      <button
        className="border p-2 rounded-xl hover:bg-slate-500"
        type="button"
      >
        Assign Pallette Location
      </button>
      <button
        className="border p-2 rounded-xl hover:bg-slate-500"
        type="button"
      >
        Set Image
      </button>
      <button
        className="border p-2 rounded-xl hover:bg-slate-500"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
