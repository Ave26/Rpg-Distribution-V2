import Layout from "@/components/layout";
import React, { ReactElement, useEffect, useState } from "react";

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
import Toast from "@/components/Parts/Toast";

export type TAssignedProducts = Pick<
  assignedProducts,
  | "barcodeId"
  | "boxSize"
  | "expirationDate"
  | "purchaseOrder"
  | "quality"
  | "skuCode"
>;

type TSKU = {
  sku: stockKeepingUnit[];
  isLoading: boolean;
};

type TToast = {
  message: string | undefined | unknown;
  isShow: boolean;
};

type TData = {
  message: string;
  scanData: {
    message: string;
    TotalAssignedProduct: number;
    capacity: number;
    row: number;
    shelfLevel: number;
    rackName: string;
  };
};

export default function BarcodeScanner() {
  const [toastData, setToastData] = useState<TToast>({
    isShow: false,
    message: "",
  });
  const [img, setImg] = useState("");
  const [data, setData] = useState<TData>({
    message: "",
    scanData: {
      capacity: 0,
      message: "",
      row: 0,
      shelfLevel: 0,
      TotalAssignedProduct: 0,
      rackName: "",
    },
  });
  const [quantity, setQuantity] = useState<number>(0);
  const [isManual, setIsManual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [disable, setDisable] = useState(false);
  // const [image, setImage] = useState("");
  const Quality = ["Good", "Damage"];
  const BoxSize = ["Small", "Medium", "Large"];
  const [SKUCode, setSKUCode] = useState<TSKU>({
    isLoading: false,
    sku: [],
  });
  const code = SKUCode.sku.map((sku) => sku.code);

  const [assignedProduct, setAssignedProduct] = useState<TAssignedProducts>({
    barcodeId: "",
    boxSize: BoxSize[0] as BoxSize,
    expirationDate: new Date(),
    purchaseOrder: "",
    quality: Quality[0] as ProductQuality,
    skuCode: "",
  });

  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastData((prev) => {
        return {
          ...prev,
          isShow: false,
        };
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [toastData.isShow]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    console.log(value);
    setAssignedProduct((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    if (name === "barcodeId") {
      if (value.length > 14) {
        setAssignedProduct((prev) => {
          return {
            ...prev,
            barcodeId: value.slice(14),
          };
        });
      } else if (value.length === 14) {
        if (SKUCode.sku.some((v) => v.barcodeId !== value)) {
          setSKUCode({
            ...SKUCode,
            sku: [],
          });
          getSKUCode(value);
        } else {
          getProductImage(value);

          SKUCode.sku.length <= 0
            ? getSKUCode(value)
            : assignedProduct.skuCode === ""
            ? setToastData({ isShow: true, message: "Incomplete Field" })
            : setScanning(true);
        }
      }
    }
  }

  useEffect(() => {
    if (scanning) {
      scanBarcode();
      console.log(data);
    }

    return () => {
      setScanning(false);
    };
  }, [scanning]);

  function getSKUCode(barcodeId: string) {
    console.log("sku triggered");
    setSKUCode({
      ...SKUCode,
      isLoading: true,
    });

    fetch("/api/product/get-sku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ barcodeId }),
    })
      .then((res) => res.json())
      .then((sku: stockKeepingUnit[]) => {
        setSKUCode({
          isLoading: false,
          sku: [...sku],
        });
        setAssignedProduct((prev) => {
          return {
            ...prev,
            skuCode: "",
            // String(sku.map((data) => data.code))[0]
          };
        });
      })
      .catch((error) => console.log(error));
  }

  function scanBarcode() {
    console.log("scan triggered");
    setIsLoading(true);
    // setDisable(true);

    fetch("/api/inbound/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        assignedProduct,
        quantity,
      }),
    })
      .then((res) => res.json())
      .then((data: unknown) => {
        // const { scanData } = data;
        // setData({
        //   scanData,
        // });

        // setToastData({
        //   isShow: true,
        //   message: data,
        // });

        console.log(data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setScanning(false);
        setIsLoading(false);
        // setDisable(false);
      });
  }

  function getProductImage(barcodeId: string) {
    console.log("finding ProductImage");
    fetch("/api/product/get-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcodeId,
      }),
    })
      .then((res) => res.json())
      .then((image) => setImg(image))
      .catch((error) => error);
  }

  useEffect(() => {
    if (isManual === false) {
      setQuantity((prev) => (prev = 0));
    }
  }, [isManual]);

  // console.log("setQuantity", quantity, "isManual", isManual);
  const inputStyle =
    "block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none";
  const labelStyle =
    "mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700";

  const spanStyle = "w-full";

  return (
    <section className="flex flex-wrap  overflow-y-scroll p-2 font-semibold transition-all md:justify-start">
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 md:w-1/2">
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
      </div>
      {/* <Toast data={toastData.message} isShow={toastData.isShow} /> */}
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
