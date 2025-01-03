import Layout from "@/components/layout";
import React, {
  ReactElement,
  ReactHTMLElement,
  ReactNode,
  useEffect,
  useState,
} from "react";

import OperationalToggle from "@/components/Parts/OperationalToggle";
import DashboardLayout from "@/components/Admin/dashboardLayout";

import {
  BoxSize,
  assignedProducts,
  ProductQuality,
  stockKeepingUnit,
} from "@prisma/client";
import Image from "next/image";
import noImage from "@/public/assets/products/noProductDisplay.png";
import Loading from "@/components/Parts/Loading";
import Input from "@/components/Parts/Input";
import { buttonStyle, InputStyle } from "@/styles/style";
import { setTime } from "@/helper/_helper";
import { InventoryMethod } from "../api/products/create";

type InputTypeMapping<T> = {
  [K in keyof T]: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

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

export interface TProductData {
  image: string | null;
  sku: TCode[];
  barcodeId: string;
  category: string;
  method?: InventoryMethod;
}

type TCode = {
  threshold: number;
  code: string;
};

export default function BarcodeScanner() {
  const [loading, setLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [message, setMessage] = useState("");

  const [serverData, setServerData] = useState<
    Record<string, any> | unknown | string
  >({});

  const [scanData, setScanData] = useState<TScanData>({
    barcodeId: "",
    quantity: 1,
    boxSize: "Small",
    date: setTime().date,
    purchaseOrder: "",
    quality: "Good",
    skuCode: "default",
  });

  useEffect(() => {
    if (!isManual) {
      setScanData((prev) => ({ ...prev, quantity: 1 }));
    }
  }, [isManual]);

  const [productData, setProductData] = useState<TProductData>({
    image: "",
    sku: [],
    barcodeId: "",
    category: "",
  });

  const fetchProductInfo = (barcodeId: string) => {
    console.log("fetching product");
    setLoading(true);
    fetch("/api/inbound/product-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcodeId }),
    })
      .then((res) => res.json())
      .then((data: TProductData) => {
        setProductData(data);
        setLoading(false);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
        setScanData((prev) => ({
          ...prev,
          skuCode: "default",
          date: new Date(),
        }));
      });
  };

  const scanBarcode = () => {
    setLoading(true);
    const category = productData.category;
    console.log("scanning barcode");
    const sku = productData.sku.find((sku) => sku.code === scanData.skuCode);
    const { barcodeId, method, ...rest } = scanData;

    try {
      fetch("/api/inbound/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcodeId: productData.barcodeId,
          ...rest,
          category,
          method: productData.method,
          threshold: sku?.threshold,
        }),
      })
        // .then((res) => res.json())
        // .then((data: unknown) => setServerData(data))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error Server Is Crying", error);
    }
  };

  function setInputTypeAndStyle(key: keyof TScanData): {
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
    style?: string;
  } {
    switch (key) {
      case "date":
        return { type: "date", style: "" };
      case "barcodeId":
        return {
          style: "col-span-1",
        };
      case "boxSize":
        return { style: "" };
      case "quality":
        return { style: "" };
      case "quantity":
        return { style: "" };
      default:
        return { type: "text" };
    }
  }

  function transformValue(v: string): number {
    const parsedValue = parseInt(v);
    if (parsedValue <= 0) {
      return 1;
    }

    return parsedValue;
  }

  function handleChange(e: TChangeEventType) {
    const { name, value } = e.target;

    if (name in scanData) {
      const typedName = name as keyof TScanData;
      setScanData((prev) => {
        return {
          ...prev,
          [typedName]: typedName === "quantity" ? transformValue(value) : value,
        };
      });

      if (name === "barcodeId") {
        const updateBarcodeId = (value: string) => {
          setScanData((prev) => ({
            ...prev,
            barcodeId: value.slice(14),
          }));
        };

        if (value.length > 14) {
          updateBarcodeId(value);
        } else if (value.length === 14) {
          value === productData.barcodeId
            ? scanBarcode()
            : fetchProductInfo(value);
        }
      }
    } else {
      console.error(`Invalid name: ${name} is not a key of Scan Data`);
    }
  }

  function renderComponent(
    key: keyof TScanData,
    placeholder: string,
    value: string | undefined
  ): ReactNode {
    switch (key) {
      case "barcodeId":
        return (
          <div className="flex gap-2">
            <Input
              key={key}
              attributes={{
                input: {
                  placeholder,
                  name: key,
                  id: key,
                  type: setInputTypeAndStyle(key).type,
                  value,
                  onChange: handleChange,
                },
                label: {
                  children: key,
                  htmlFor: key,
                },
              }}
            />

            {/* <div>
              <div key={key} className="flex gap-2">
                {!isManual && (
                  <Input
                    attributes={{
                      input: {
                        id: key,
                        type: "number",
                        value,
                        name: key,
                        onChange: handleChange,
                        min: 1,
                      },
                      label: {
                        children: "Quantity",
                        htmlFor: key,
                      },
                    }}
                  />
                )}
                <div className="flex items-center justify-center">
                  {loading ? (
                    <Loading />
                  ) : (
                    <OperationalToggle
                      isManual={isManual}
                      setIsManual={setIsManual}
                    />
                  )}
                </div>
              </div>
            </div> */}
          </div>
        );
      case "date":
      case "purchaseOrder":
        return (
          <Input
            key={key}
            attributes={{
              input: {
                placeholder,
                name: key,
                id: key,
                type: setInputTypeAndStyle(key).type,
                value,
                onChange: handleChange,
              },
              label: {
                children: key,
                htmlFor: key,
              },
            }}
          />
        );

      case "skuCode":
        return (
          <select
            key={key}
            name={key}
            value={scanData[key]}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value={"default"} disabled>
              Select SKU Code
            </option>

            {Array.isArray(productData.sku) &&
              productData.sku.map((opt) => {
                return (
                  <option value={opt.code} key={opt.code}>
                    {opt.code}
                  </option>
                );
              })}
          </select>
        );
      case "quality":
        return (
          <select
            key={key}
            name={key}
            value={scanData[key]}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value={"default"} disabled>
              Select Quality
            </option>
            {Object.keys(ProductQuality).map((opt) => {
              return (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              );
            })}
          </select>
        );
      case "boxSize":
        return (
          <select
            key={key}
            name={key}
            value={scanData[key]}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value={"default"} disabled>
              Select Box Size
            </option>
            {Object.keys(BoxSize).map((opt) => {
              return (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              );
            })}
          </select>
        );

      case "quantity":
        return (
          <div key={key} className="flex w-full gap-2">
            {isManual && (
              <Input
                attributes={{
                  input: {
                    id: key,
                    type: "number",
                    value,
                    name: key,
                    onChange: handleChange,
                    min: 1,
                  },
                  label: {
                    children: "Quantity",
                    htmlFor: key,
                  },
                }}
              />
            )}
            <div
              className={`flex ${
                !isManual ? "w-full" : "w-10"
              }  items-center justify-center p-2`}
            >
              {loading ? (
                <Loading />
              ) : (
                <div className="flex  origin-center items-center justify-center rounded-full border border-black  hover:scale-125">
                  <OperationalToggle
                    isManual={isManual}
                    setIsManual={setIsManual}
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <>no component available</>;
    }
  }

  return (
    <section className="relative flex h-full w-full flex-wrap  rounded-md bg-white p-2 font-semibold transition-all">
      <div className="grid h-full w-full flex-col gap-2 md:grid-cols-2 md:flex-row md:gap-4">
        <div className="rouned-sm grid h-fit w-fit grid-flow-row grid-cols-2 gap-2 rounded-lg  bg-sky-300/70 p-2 shadow-2xl shadow-blue-600/25 transition-all ease-in-out md:h-full md:w-full md:grid-cols-1 md:rounded-none ">
          {Object.keys(scanData).map((key) => {
            const typedKey = key as keyof TScanData;
            const barcodePlaceholder =
              typedKey === "barcodeId" ? "eg: 14087460734592" : "";
            const value = scanData[key as keyof TScanData]?.toLocaleString();
            return (
              <div
                className={`${setInputTypeAndStyle(typedKey).style}  h-fit`}
                key={key}
              >
                {renderComponent(typedKey, barcodePlaceholder, value)}
              </div>
            );
          })}
        </div>

        <div className="flex h-fit items-center justify-center  border border-black p-2 md:h-full md:w-full">
          <div className="relative flex h-[15.5em] w-[15.5em] scale-105 rounded-md shadow-xl shadow-blue-600/25">
            <Image
              src={productData.image || noImage}
              alt="no Image"
              fill
              priority
              className="rounded-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
        <div className="h-10">
          <button
            className={buttonStyle}
            onClick={() => {
              setProductData((prev) => ({
                ...prev,
                image: "",
                barcodeId: "",
                sku: [],
              }));
              setScanData(() => {
                return {
                  barcodeId: "",
                  quantity: 1,
                  boxSize: "Small",
                  date: setTime().date,
                  purchaseOrder: "",
                  quality: "Good",
                  supplierName: "",
                  skuCode: "default",
                  category: "",
                };
              });
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <span>{JSON.stringify(scanData, null, 2)}</span>
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
