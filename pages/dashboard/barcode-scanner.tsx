import Layout from "@/components/layout";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { BoxSize, assignedProducts, ProductQuality } from "@prisma/client";
import Image from "next/image";
import noImage from "@/public/assets/products/noProductDisplay.png";
import Input from "@/components/Parts/Input";
import { buttonStyleDark, InputStyle } from "@/styles/style";
import { InventoryMethod } from "../api/products/create";
import { ProductInfo } from "../api/inbound/product-info";
import { AiOutlineLoading } from "react-icons/ai";

export type TAssignedProducts = Pick<
  assignedProducts,
  "barcodeId" | "boxSize" | "purchaseOrder" | "quality" | "skuCode"
>;

export type TScanData = TAssignedProducts & {
  quantity: number;
  date: Date;
  method?: InventoryMethod;
};

export type TChangeEventType =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLSelectElement>;

export default function BarcodeScanner() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    barcodeId: "",
    category: "",
    image: "",
    method: "",
    sku: [],
  });

  return (
    <section className="h-full w-full">
      <section className="grid h-full max-h-full auto-cols-fr auto-rows-fr grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex h-full w-full bg-white p-2 text-white">
          <BarcodeScan states={{ productInfo, setProductInfo }} />
        </div>
        <div className="relative flex items-center  justify-center bg-white p-2">
          <div className="relative flex h-[70%] w-[70%] scale-105 rounded-md shadow-xl shadow-blue-600/25">
            <Image
              src={productInfo.image || noImage}
              alt="no Image"
              fill
              priority
              className="rounded-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      </section>

      {/* <>{JSON.stringify(productInfo)}</> */}
    </section>
  );
}

BarcodeScanner.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};

interface BarcodeScanProps {
  states: {
    productInfo: ProductInfo;
    setProductInfo: React.Dispatch<React.SetStateAction<ProductInfo>>;
  };
}

function BarcodeScan({ states }: BarcodeScanProps) {
  const { productInfo, setProductInfo } = states;
  const [loading, setLoading] = useState(false);

  const [barcodeId, setBarcodeId] = useState("");
  // const [image, setImage] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState(1);
  const [boxSize, setBoxSize] = useState<BoxSize | "default">("default");
  const [skuCode, setSkuCode] = useState("default");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [quality, setQuality] = useState<ProductQuality>("Good");

  const barcodeIdRef = useRef(barcodeId);

  useEffect(() => {
    // Only trigger if barcodeId has changed
    if (barcodeId !== barcodeIdRef.current) {
      barcodeIdRef.current = barcodeId; // Update the ref with new barcodeId

      if (!barcodeId) return; // Short-circuit if no barcodeId

      const controller = new AbortController();
      const { signal } = controller;

      const form = {
        category: productInfo.category,
        method: productInfo.method as InventoryMethod,
        threshold:
          productInfo.sku.find((v) => v.code === skuCode)?.threshold ?? 0,
        barcodeId,
        purchaseOrder,
        quality,
        skuCode,
        currentBarcodeId: productInfo.barcodeId,
        quantity,
        boxSize,
        date,
      };

      const debounce = setTimeout(() => {
        setLoading(true);

        fetch(`/api/inbound/product-info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          signal,
        })
          .then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch");
            const data: ProductInfo = await res.json();
            if (barcodeId !== productInfo.barcodeId) {
              res.ok && setProductInfo(data);
            }
          })
          .catch((error: Error) => {
            console.log(error);
            // console.log(error.name);
            // setSkuCode("default");
            // setBarcodeId("");
            // alert(error);
          })
          .finally(() => setLoading(false));
      }, 10);

      return () => {
        clearTimeout(debounce);
        controller.abort();
      };
    }
  }, [
    barcodeId, // Only include barcodeId as dependency to trigger when it changes
    setProductInfo,
    productInfo,
    quantity,
    boxSize,
    date,
    purchaseOrder,
    quality,
    skuCode,
    setSkuCode,
    setBarcodeId,
  ]);

  return (
    <div className="flex h-full w-full flex-col gap-2 p-2">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 transition-all">
          <Input
            inputStyles="text-black"
            labelStyles="text-black"
            attributes={{
              input: {
                id: "barcodeId",
                type: "text",
                name: barcodeId,
                value: barcodeId,
                onChange: (e) => {
                  const { value } = e.target;
                  if (value.length <= productInfo.barcodeId.length) {
                    setBarcodeId(value);
                  } else {
                    setBarcodeId(value.slice(productInfo.barcodeId.length));
                  }
                },
              },
              label: {
                children: "barcode Id",
                htmlFor: "barcodeId",
              },
            }}
          />
          <div
            className={`flex w-[40%] items-center justify-center rounded-md border border-white text-black`}
          >
            {loading ? (
              <AiOutlineLoading className={`animate-spin`} size={30} />
            ) : (
              <Input
                inputStyles="text-black"
                labelStyles="text-black"
                attributes={{
                  input: {
                    id: "quantity",
                    name: String(quantity),
                    value: quantity,
                    type: "number",
                    min: 0,
                    onChange: (e) => {
                      const { value } = e.target;
                      setQuantity(
                        !value || Number.isNaN(value) ? 0 : parseInt(value)
                      );
                    },
                  },
                  label: {
                    htmlFor: "quantity",
                    children: "Quantity",
                  },
                }}
              />
            )}
          </div>
        </div>

        <Input
          inputStyles="text-black"
          labelStyles="text-black"
          attributes={{
            input: {
              id: "date",
              name: "date",
              value: date.toISOString().split("T")[0],
              type: "date",
              onChange: (e) => {
                const { value } = e.target;
                setDate(new Date(value));
              },
            },
            label: {
              htmlFor: "date",
              children: "Date",
            },
          }}
        />

        <Input
          inputStyles="text-black"
          labelStyles="text-black"
          attributes={{
            input: {
              id: "purchaseOrder",
              name: purchaseOrder,
              value: purchaseOrder,
              type: "text",
              onChange: (e) => setPurchaseOrder(e.target.value),
            },
            label: {
              htmlFor: "purchaseOrder",
              children: "Purchase Order",
            },
          }}
        />
      </div>
      <div className="grid h-full grid-cols-2 gap-2 transition-all sm:h-fit sm:grid-cols-1">
        <select
          name="skuCode"
          id="skuCode"
          value={skuCode}
          className={`${InputStyle} border border-white font-black uppercase text-black`}
          onChange={(e) => {
            setSkuCode(e.target.value);
          }}
        >
          <option value="default" disabled>
            Select SKU
          </option>
          {Array.isArray(productInfo.sku) &&
            productInfo.sku.map((v) => (
              <option key={v.code} value={v.code}>
                {v.code}
              </option>
            ))}
        </select>

        <select
          name="quality"
          id="quality"
          value={quality}
          className={`${InputStyle} border border-white font-black uppercase text-black`}
          onChange={(e) => {
            const { value } = e.target;
            const quality = value as ProductQuality;
            setQuality(quality);
          }}
        >
          <option value="default" disabled>
            Select Quality
          </option>
          {Object.keys(ProductQuality).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          name="boxSize"
          id="boxSize"
          value={boxSize}
          className={`${InputStyle} border border-white font-black uppercase text-black`}
          onChange={(e) => {
            const { value } = e.target;
            const boxSize = value as BoxSize;
            setBoxSize(boxSize);
          }}
        >
          <option value="default" disabled>
            Select Box Size
          </option>
          {Object.keys(BoxSize).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setProductInfo((state) => ({ ...state, barcodeId: "" }));
            setSkuCode("default");
            setBarcodeId("");
          }}
          className={`${buttonStyleDark} transition-all active:scale-95`}
        >
          Reset
        </button>
      </div>

      {/* <div className="flex gap-2">
        <h1>{barcodeId}</h1>
        <h1>{skuCode}</h1>
        <h1>{date.toISOString().slice(0, 10)}</h1>
        <h1>{image}</h1>
        <h1>
          {productInfo.sku.find((v) => v.code === skuCode)?.threshold ?? 0}
        </h1>
        <h1>{quantity}</h1>
        <h1>{boxSize}</h1>
        <h1>{purchaseOrder}</h1>
        <h1>{productInfo.method}</h1>
      </div> */}
    </div>
  );
}
