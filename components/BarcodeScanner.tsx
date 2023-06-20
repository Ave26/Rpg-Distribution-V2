import React, { useEffect, useRef, useState } from "react";
import { Product } from "@/types/types";
import Image from "next/image";

function BarcodeScanner() {
  const [v, setV] = useState<string>("");
  const ref = useRef<string | null>(null);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (v !== "") {
      ref.current = v;
      console.log(ref.current);
    }
  }, [v]);

  useEffect(() => {
    console.log(v);
    // setTimeout(() => {
    setV("");
    // }, 200);
  }, [v]);

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
    <section className="border-black w-full h-screen relative p-7">
      <div className="flex justify-center w-fit flex-col">
        <label htmlFor="barcode">Barcode Id:</label>
        <input
          autoFocus
          id="barcode"
          type="text"
          value={v}
          onChange={(e) => {
            setV(e.target.value);
          }}
          className="text-black p-4 border border-slate-900 "
        />
      </div>
      {ref.current && (
        <div className="border-blue-400 border w-fit p-2 mt-2 drop-shadow-sm cursor-pointer select-none">
          {ref.current}
        </div>
      )}
      <h1>{data?.id}</h1>
      <h1>{data?.barcodeId}</h1>

      {data && (
        <Image
          src={data?.img}
          alt="productImg"
          className="w-[20em] h-[20em]"
          width={20}
          height={20}
        />
      )}
    </section>
  );
}

export default BarcodeScanner;
