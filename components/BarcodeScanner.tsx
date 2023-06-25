import React, { useEffect, useRef, useState } from "react";
import { Product } from "@/types/types";
import Image from "next/image";
import { TiMessageTyping } from "react-icons/ti";
import { BiQrScan } from "react-icons/bi";

function BarcodeScanner() {
  const [v, setV] = useState<string>("");
  const [poId, setPoId] = useState<string>("");
  const [isTypable, setisTypable] = useState<boolean>(false);
  const ref = useRef<string | null>(null);
  const [data, setData] = useState<any>();
  const [isToggle, setIsToggle] = useState<boolean>(false);

  useEffect(() => {
    if (v != "") {
      ref.current = v;
    }
  }, [v]);

  useEffect(() => {
    console.log("rendering");
    if (!isTypable) {
      setTimeout(() => {
        setV("");
      }, 200);
    }
  }, [isTypable, v]);

  useEffect(() => {
    if (v) {
      try {
        (async () => {
          const response = await fetch("/api/product/find", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              barcodeId: ref.current,
            }),
          });

          const json = await response.json();
          const product = await json?.product;
          setData(product);
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }, [v]);

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-start p-7 font-bold">
      <div className="flex w-full flex-col items-center justify-start  border border-black p-5">
        <label htmlFor="barcode" className="w-full">
          Barcode Id:
        </label>
        <div className="flex w-full items-center justify-between px-4 py-2">
          <input
            autoFocus
            id="barcode"
            type="text"
            value={v}
            onChange={(e) => {
              setV(e.target.value);
            }}
            className="border border-slate-900 p-4 text-black"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setisTypable((prevType) => !prevType);
            }}
            className="flex h-[3.7em] w-12  items-center justify-center border border-black py-2">
            {isTypable ? (
              <TiMessageTyping className="h-full  w-full border-black" />
            ) : (
              <BiQrScan className="h-full  w-full border-black" />
            )}
          </button>
        </div>
        <div className="flex w-full flex-col items-start justify-center">
          <label htmlFor="poId" className="w-full ">
            Purchase Order Id:
          </label>
          <input
            autoFocus
            id="poId "
            type="text"
            value={poId}
            onChange={(e) => {
              setPoId(e.target.value);
            }}
            className="mx-4 my-2 border border-slate-900 p-4 text-black"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-20 border border-black py-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            className="peer sr-only"
            onClick={() => {
              setIsToggle((prevToggle) => !prevToggle);
            }}
          />
          <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-green-600"></div>
          {/* <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {isToggle ? "Damage" : "Good"}
          </span> */}
        </label>

        <div>
          <select className="p-2">
            <option>Small</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>
      {ref.current && (
        <div className="mt-2 w-fit cursor-pointer select-none border border-blue-400 p-2 drop-shadow-sm">
          {ref.current}
        </div>
      )}
      <h1>{data?.id}</h1>
      <h1>{data?.barcodeId}</h1>

      {data && (
        <Image
          src={data?.img}
          alt="productImg"
          className="h-[20em] w-[20em]"
          width={20}
          height={20}
        />
      )}
    </section>
  );
}

export default BarcodeScanner;
