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

type InputTypeMapping<T> = {
  [K in keyof T]: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

export type TAssignedProducts = Pick<
  assignedProducts,
  | "barcodeId"
  | "boxSize"
  | "purchaseOrder"
  | "quality"
  | "supplierName"
  | "skuCode"
>;

export type TScanData = TAssignedProducts & {
  quantity: number;
  date: Date;
};

export type TChangeEventType =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLSelectElement>;

// type TSKU = {
//   sku: stockKeepingUnit[];
//   isLoading: boolean;
// };

// type TToast = {
//   message: string | undefined | unknown;
//   isShow: boolean;
// };

// type TData = {
//   message: string;
//   scanData: {
//     message: string;
//     TotalAssignedProduct: number;
//     capacity: number;
//     row: number;
//     shelfLevel: number;
//     rackName: string;
//   };
// };

export interface TProductData {
  image: string | null;
  sku: TCode[];
  barcodeId: string;
  category: string;
}

type TCode = {
  threshold: number;
  code: string;
};

export default function BarcodeScanner() {
  const [loading, setLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);

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
    supplierName: "",
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

  console.log(scanData);

  // const [toastData, setToastData] = useState<TToast>({
  //   isShow: false,
  //   message: "",
  // });
  // const [img, setImg] = useState("");
  // const [data, setData] = useState<TData>({
  //   message: "",
  //   scanData: {
  //     capacity: 0,
  //     message: "",
  //     row: 0,
  //     shelfLevel: 0,
  //     TotalAssignedProduct: 0,
  //     rackName: "",
  //   },
  // });

  // const [quantity, setQuantity] = useState<number>(0);

  // const [disable, setDisable] = useState(false);
  // const [image, setImage] = useState("");
  // const Quality = ["Good", "Damage"];
  // const BoxSize = ["Small", "Medium", "Large"];
  // const [SKUCode, setSKUCode] = useState<TSKU>({
  //   isLoading: false,
  //   sku: [],
  // });
  // const code = SKUCode.sku.map((sku) => sku.code);

  // const [image, setImage] = useState("");
  // const [SKUCode, setSKUCode] = useState<string[]>([]);

  // const [assignedProduct, setAssignedProduct] = useState<TAssignedProducts>({
  //   barcodeId: "",
  //   boxSize: BoxSize[0] as BoxSize,
  //   expirationDate: setTime().date,
  //   purchaseOrder: "",
  //   quality: Quality[0] as ProductQuality,
  //   supplierName: "",
  //   skuCode: "default",
  // });

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setToastData((prev) => {
  //       return {
  //         ...prev,
  //         isShow: false,
  //       };
  //     });
  //   }, 1200);
  //   return () => clearTimeout(timer);
  // }, [toastData.isShow]);

  // function handleChange(
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) {
  //   const { name, value } = e.target;

  //   console.log(value);
  //   setAssignedProduct((prev) => {
  //     return {
  //       ...prev,
  //       [name]: value,
  //     };
  //   });

  //   if (name === "barcodeId") {
  //     if (value.length > 14) {
  //       setAssignedProduct((prev) => {
  //         return {
  //           ...prev,
  //           barcodeId: value.slice(14),
  //         };
  //       });
  //     } else if (value.length === 14) {
  //       if (SKUCode.sku.some((v) => v.barcodeId !== value)) {
  //         setSKUCode({
  //           ...SKUCode,
  //           sku: [],
  //         });
  //         getSKUCode(value);
  //       } else {
  //         getProductImage(value);

  //         SKUCode.sku.length <= 0
  //           ? getSKUCode(value)
  //           : assignedProduct.skuCode === ""
  //           ? "" // setToastData({ isShow: true, message: "Incomplete Field" })
  //           : setScanning(true);
  //       }
  //     }
  //   }
  // }

  // function getSKUCode(barcodeId: string) {
  //   console.log("sku triggered");
  //   setSKUCode({
  //     ...SKUCode,
  //     isLoading: true,
  //   });

  //   fetch("/api/product/get-sku", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ barcodeId }),
  //   })
  //     .then((res) => res.json())
  //     .then((sku: stockKeepingUnit[]) => {
  //       setSKUCode({
  //         isLoading: false,
  //         sku: [...sku],
  //       });
  //       setAssignedProduct((prev) => {
  //         return {
  //           ...prev,
  //           skuCode: "",
  //           // String(sku.map((data) => data.code))[0]
  //         };
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // }

  // function getProductImage(barcodeId: string) {
  //   console.log("finding ProductImage");
  //   fetch("/api/product/get-image", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       barcodeId,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     // .then((image) => setImg(image))
  //     .catch((error) => error);
  // }

  // useEffect(() => {
  //   console.log(productData);
  // }, [productData]);
  // useEffect(() => {
  //   console.log(assignedProduct);
  // }, [assignedProduct]);

  // function scanBarcode() {
  //   console.log("scan triggered");
  //   setIsLoading(true);
  //   // setDisable(true);

  //   fetch("/api/inbound/scan", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },

  //     body: JSON.stringify({
  //       scanData,
  //       quantity,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data: unknown) => {
  //       // const { scanData } = data;
  //       // setData({
  //       //   scanData,
  //       // });s

  //       // setToastData({
  //       //   isShow: true,
  //       //   message: data,
  //       // });

  //       console.log(data);
  //     })
  //     .catch((error) => console.log(error))
  //     .finally(() => {
  //       setScanning(false);
  //       setIsLoading(false);
  //       // setDisable(false);
  //     });
  // }

  // console.log("setQuantity", quantity, "isManual", isManual);
  // const inputStyle =
  //   "block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none";
  // const labelStyle =
  //   "mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700";

  // const spanStyle = "w-full";

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
      .finally(() => setLoading(false));
  };

  const scanBarcodeTest = () => {
    const category = productData.category;
    console.log("scanning barcode");
    const sku = productData.sku.find((sku) => sku.code === scanData.skuCode);
    const { barcodeId, ...rest } = scanData;
    console.log(sku);

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
          threshold: sku?.threshold,
        }),
      })
        .then((res) => res.json())
        .then((data: unknown) => setServerData(data));
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
            ? scanBarcodeTest()
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
      case "supplierName":
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
    <section className="relative flex h-full w-full overflow-y-scroll rounded-md bg-white p-2 font-semibold transition-all">
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
      {/* <div>{JSON.stringify(serverData, null, 2)}</div> */}
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

{
  /* <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 md:w-1/2">
        <span className={spanStyle}>
          <label htmlFor="barcodeId" className={labelStyle}>
            Barcode Id
          </label>
          <span className="relative block">
            <input
              // disabled={disable}
              type="text"
              name="barcodeId"
              placeholder="eg: 14087460734592"
              className={inputStyle}
              value={assignedProduct.barcodeId}
              onChange={handleChange}
            />
            {isManual && (
              <input
                type="number"
                value={quantity}
                min={0}
                max={100}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="absolute right-9 top-1 block h-9 w-20 animate-emerge appearance-none rounded border border-gray-200 bg-white px-4 py-3 leading-tight text-gray-700 transition-all focus:border-gray-500 focus:bg-white focus:outline-none"
              />
            )}

            <div className="absolute right-2 top-3">
              <OperationalToggle
                isManual={isManual}
                setIsManual={setIsManual}
              />
            </div>
          </span>
        </span>

        <span className={inputStyle}>
          <span>
            Bin: {data.scanData?.rackName}
            {data?.scanData?.row}-{data?.scanData?.shelfLevel}
          </span>
        </span>

        <span
          className={
            "block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
          }
        >
          <label htmlFor="boxSize" className={labelStyle}>
            Box Size
          </label>
          <select
            id="boxSize"
            name="boxSize"
            className={inputStyle}
            onChange={handleChange}
            value={assignedProduct.boxSize}
          >
            {BoxSize.map((size, index) => (
              <option key={index}>{size}</option>
            ))}
          </select>
        </span>
        <span className={spanStyle}>
          <label htmlFor="expirationDate" className={labelStyle}>
            Expiration Date
          </label>
          <input
            name="expirationDate"
            id="expirationDate"
            type="date"
            className={inputStyle}
            value={String(assignedProduct.expirationDate)}
            onChange={handleChange}
          />
        </span>
        <span className={spanStyle}>
          <label htmlFor="purchaseOrder" className={labelStyle}>
            Purchase Order
          </label>
          <input
            id="purchaseOrder"
            name="purchaseOrder"
            type="text"
            className={inputStyle}
            placeholder="eg: PO-12345"
            value={assignedProduct.purchaseOrder}
            onChange={handleChange}
          />
        </span>
        <span className={spanStyle}>
          <label htmlFor="quality" className={labelStyle}>
            Quality
          </label>
          <select
            id="quality"
            name="quality"
            className={inputStyle}
            onChange={handleChange}
            value={assignedProduct.quality}
          >
            {Quality.map((size, index) => (
              <option key={index}>{size}</option>
            ))}
          </select>
        </span>
        <span className={spanStyle}>
          <label htmlFor="skuCode" className={labelStyle}>
            Stock Keeping Unit
          </label>
          <span className="relative block h-fit w-full">
            <select
              id="skuCode"
              name="skuCode"
              className={
                assignedProduct.skuCode === ""
                  ? "mb-3 block w-full appearance-none rounded border border-red-500 bg-gray-200 px-4 py-3 uppercase leading-tight text-gray-700 focus:bg-white focus:outline-none"
                  : inputStyle
              }
              onChange={handleChange}
              value={assignedProduct.skuCode}
            >
              <option value="" className="uppercase" disabled hidden>
                {SKUCode.sku.length <= 0 ? "" : "Please choose sku code"}
              </option>
              {SKUCode.sku?.map((sku) => (
                <option key={sku.id} className="uppercase">
                  {sku.code}
                </option>
              ))}
            </select>

            <div className="absolute right-2 top-1.5">
              {SKUCode.isLoading ? (
                <Loading />
              ) : (
                <button
                  className="p-2 text-center text-xs font-bold uppercase"
                  onClick={() => {
                    setSKUCode({
                      ...SKUCode,
                      sku: [],
                    });
                  }}
                >
                  X
                </button>
              )}
            </div>
          </span>
        </span>
      </div>
      <div className="relative flex h-[30em] w-[20em] flex-grow items-center justify-center border border-black">
        {isLoading ? (
          <Loading />
        ) : (
          <Image priority src={img || noImage} alt={"Product Image"} fill />
        )}
      </div> */
}
{
  /* <Toast data={toastData.message} isShow={toastData.isShow} /> */
}
