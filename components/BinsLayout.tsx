import React, { SetStateAction, useEffect, useReducer, useState } from "react";
import { Bin } from "@/types/inventory";
import { bins, assignedProducts } from "@prisma/client";
import { EntriesTypes, dataEntriesTypes } from "@/types/binEntries";
import Toast from "./Parts/Toast";
import {
  getProductTotalQuantity,
  getRequiredBinData,
} from "@/helper/_componentHelpers";
import { TFormData } from "@/types/inputTypes";

interface BinsProps {
  isLoading?: boolean;
  bins: Bin[] | undefined;
  dataEntries: dataEntriesTypes;
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
}

interface SetRequestTypes {
  setQuantity: React.Dispatch<SetStateAction<number>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

interface RequestTypes {
  quantity: number;
  barcodeId: string | null;
  isLoading: boolean;
}

type ToastTypes = {
  message: string;
  isShow: boolean;
};

export default function BinsLayout({
  bins,
  isLoading,
  dataEntries,
  formData,
  setFormData,
}: BinsProps) {
  const [coveredBins, setCoverdBins] = useState<String[]>([]);
  const { productEntry, setProductEntry } = dataEntries;
  const [toast, setToast] = useState<ToastTypes>({
    isShow: false,
    message: "",
  });
  const titles = [
    "Quantity",
    "Product Category",
    "Product Name",
    "Product SKU",
    "Price",
    "Bin",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({ ...toast, isShow: false });
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.isShow]);

  async function selectEntry(bin: Bin) {
    const { barcodeId, clientName, destination, productName, quantity, truck } =
      formData;
    if (!barcodeId || !quantity) {
      console.log("Incomplete Field");
      return setToast({
        isShow: true,
        message: "Incomplete Field",
      });
    }
    bins ? getProductTotalQuantity(bins, formData.quantity, setToast) : null;
    // const quantity = Number(formData?.quantity);
    const { newEntry, binId } = getRequiredBinData(bin, quantity);
    const isExisted =
      productEntry?.find(
        (existingEntry) => existingEntry.barcodeId === newEntry.barcodeId
      ) !== undefined;

    if (isExisted) {
      setProductEntry(
        productEntry.map((entry) =>
          entry.barcodeId === newEntry.barcodeId &&
          !entry.binIdsEntries.includes(binId)
            ? { ...entry, binIdsEntries: [...entry.binIdsEntries, binId] }
            : entry
        )
      );
      setFormData({ ...formData, quantity: 0 });
    } else {
      productEntry && setProductEntry([...productEntry, newEntry]);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const threshold = formData.quantity;
      let negatedThreshold = threshold;
      const coveredBin = [];

      if (bins && formData.barcodeId) {
        let totalProductQuantity: number = 0;
        for (let i = 0; i < bins.length; i++) {
          totalProductQuantity += bins[i]._count.assignedProducts;
        }

        if (formData.quantity > totalProductQuantity) {
          setToast({ isShow: true, message: "Requested Quantity Exceeded" });
          return console.log("Requested Quantity Exceeded");
        }

        console.log("Number:", totalProductQuantity);

        for (let bin of bins) {
          const binCount = bin._count?.assignedProducts;
          if (negatedThreshold <= 0) {
            break;
          }
          negatedThreshold -= binCount;
          coveredBin.push(bin?.id);
          console.log("negated:", negatedThreshold);
        }

        setCoverdBins(coveredBin);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [formData.quantity]);

  if (!bins) {
    return <>No data</>;
  }

  return (
    <>
      <div className="h-full w-full select-none overflow-y-auto rounded-t-md border md:h-[25em] md:max-h-[25em] md:min-w-0 md:max-w-[45em]">
        {isLoading ? (
          <>loading...</>
        ) : (
          <table className="rounded-t-md text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="w-full rounded-t-lg bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {titles.map((title, index) => {
                  return (
                    <th
                      scope="col"
                      key={index}
                      className={`px-6 py-3 md:py-7 ${
                        (index === 0 && "rounded-tl-md") ||
                        (index === 5 && "rounded-tr-md")
                      }`}>
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {bins?.map((bin: Bin, index) => {
                return (
                  <tr
                    onClick={(e) => {
                      e.preventDefault();
                      selectEntry(bin);
                    }}
                    key={index}
                    className={`text-white transition-all ${
                      coveredBins.includes(bin?.id)
                        ? "ring-2 ring-inset ring-white transition-all delay-100"
                        : "ring-none"
                    } 
                  
                  
                    ${
                      productEntry?.find((value) =>
                        value.binIdsEntries.includes(bin.id)
                      )
                        ? "bg-emerald-500"
                        : "bg-gray-800"
                    }
                  `}>
                    <td className="px-6 py-4">
                      {Number(bin?._count.assignedProducts)}
                    </td>
                    <td className="px-6 py-4">
                      {String(bin?.racks?.categories?.category)}
                    </td>
                    <td className="px-6 py-4">
                      {
                        bin?.assignedProducts?.map((assign) => {
                          return assign?.products?.productName;
                        })[0]
                      }
                    </td>
                    <td className="px-6 py-4">
                      {
                        bin?.assignedProducts?.map((assign) => {
                          return Number(assign?.products?.price);
                        })[0]
                      }
                    </td>
                    <td className="px-6 py-4">
                      {/* {
                      bin?.assignedProducts?.map(
                        (assign) => assign?.products?.price
                      )[0]
                    } */}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {bin?.racks?.name} {bin?.row} - {bin?.shelfLevel}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* <tfoot>
          <tr className="font-semibold text-gray-900 dark:text-white">
            <th scope="row" className="px-6 py-3 text-base">
              Total
            </th>
            <td className="px-6 py-3">3</td>
            <td className="px-6 py-3">21,000</td>
          </tr>
        </tfoot> */}
          </table>
        )}
      </div>
      <Toast data={toast.message} isShow={toast.isShow} />
    </>
  );
}
