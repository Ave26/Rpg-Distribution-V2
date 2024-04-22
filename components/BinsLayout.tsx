import React, { SetStateAction, useEffect, useReducer, useState } from "react";
import { Bin } from "@/types/inventory";
import {
  bins,
  assignedProducts,
  stockKeepingUnit,
  products,
} from "@prisma/client";
import { EntriesTypes, dataEntriesTypes } from "@/types/binEntries";
import { trucks as TTrucks } from "@prisma/client";
import Toast from "./Parts/Toast";
import {
  getProductTotalQuantity,
  getRequiredBinData,
} from "@/helper/_componentHelpers";
import { TFormData } from "@/types/inputTypes";
// import { TBins } from "@/types/binsTypes";

type TBins = bins & {
  _count: {
    assignedProducts: number;
  };
  assignedProducts: TAssignedProducts[];
};

type TAssignedProducts = assignedProducts & {
  sku: stockKeepingUnit;
  products: products;
};

interface BinsLayoutProps {
  isLoading?: boolean;
  bins: TBins[] | undefined;
  dataEntries: dataEntriesTypes;
  formData: TFormData;
  trucks: TTrucks[];
  truckCapacity?: number | undefined;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
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

type TSKU = {
  data: string;
  allData: string[];
};

export default function BinsLayout({
  bins,
  isLoading,
  dataEntries,
  formData,
  setFormData,
  setIsDisabled,
  trucks,
  truckCapacity,
}: BinsLayoutProps) {
  const [coveredBins, setCoverdBins] = useState<String[]>([]);
  const [skus, setSkus] = useState<stockKeepingUnit[]>([]);
  const [totalWeightLists, setTotalWeightList] = useState<number[]>([]);

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
  async function selectEntry(bin: TBins) {
    try {
      const {
        barcodeId,
        clientName,
        destination,
        quantity,
        truck,
        productName,
      } = formData;
      if (!barcodeId || !quantity || !clientName || !destination) {
        return setToast({
          isShow: true,
          message: "Incomplete Field",
        });
      }
      bins ? getProductTotalQuantity(bins, formData.quantity, setToast) : null;
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
      } else {
        productEntry && setProductEntry([...productEntry, newEntry]);
      }

      setIsDisabled(true);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // finding the sum for each product ordered
    try {
      const entryProducts = productEntry?.map((entry) => {
        return { total: entry.totalQuantity, weight: entry.weight };
      });

      const listofTotalWeight = [];

      for (let entryProduct of entryProducts!) {
        const result = entryProduct.total * entryProduct.weight;
        listofTotalWeight.push(result);
      }
      const sum = listofTotalWeight.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

      const truck = trucks.find((truck) => truck.truckName === formData.truck);
      const result = Number(truck?.payloadCapacity) - sum;
      // console.log("result", result);

      if (sum > Number(truck?.payloadCapacity)) {
        setToast((prev) => {
          return {
            ...prev,
            isShow: true,
            message: `Truck Capacity Exceeded ${result}`,
          };
        });
      }

      setFormData((prev) => {
        return {
          ...prev,
          truckCargo: result,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }, [productEntry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({ ...toast, isShow: false });
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.isShow]);

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

        // console.log("Number:", totalProductQuantity);

        for (let bin of bins) {
          const binCount = bin._count?.assignedProducts;
          if (negatedThreshold <= 0) {
            break;
          }
          negatedThreshold -= binCount;
          coveredBin.push(bin?.id);
          // console.log("negated:", negatedThreshold);
        }

        setCoverdBins(coveredBin);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [formData.quantity]);

  // useEffect(() => {
  //   // If product entry is 0 then set the skuData to be ""
  //   if (Number(productEntry?.length) === 0) {
  //     console.log(productEntry);
  //     setSku((prev) => {
  //       return {
  //         ...prev,
  //         allData: [],
  //         data: "",
  //       };
  //     });
  //   }
  // }, [productEntry]);

  // useEffect(() => {
  //   // this will search the sku and will be push through skus
  //   let controller = new AbortController();

  //   if (Number(productEntry?.length) > 0) {
  //     fetch("/api/sku-find", {
  //       method: "POST",
  //       signal: controller.signal,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },

  //       body: JSON.stringify({
  //         skuCode: sku.data,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((sku) => {
  //         if (Number(productEntry?.length) > 0) {
  //           console.log("executed A");

  //           setSku((prev) => {
  //             return {
  //               ...prev,
  //               allData: [...prev.allData, sku],
  //             };
  //           });
  //         } else {
  //           console.log("executed B");
  //           setSku((prev) => {
  //             return {
  //               ...prev,
  //               allData: [sku],
  //             };
  //           });
  //         }
  //       })
  //       .catch((error) => error);
  //   }

  //   return () => controller.abort();
  // }, [sku.data]);

  if (!bins) {
    return <>No data</>;
  }
  const tdStyle = "px-6 py-4 text-center";

  return (
    <>
      <div className="h-full w-full select-none overflow-y-auto rounded-t-md border md:h-[25em]">
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
                      }`}
                    >
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {bins?.map((bin: TBins) => {
                return (
                  <tr
                    key={bin.id}
                    onClick={(e) => {
                      e.preventDefault();
                      selectEntry(bin);
                      const skuCode = bin.assignedProducts.map(
                        (assignedProduct) => assignedProduct.skuCode
                      )[0];

                      // setSku((prev) => {
                      //   return {
                      //     ...prev,
                      //     data: skuCode,
                      //   };
                      // });
                    }}
                    className={`text-white transition-all ${
                      coveredBins.includes(bin?.id)
                        ? "ring-2 ring-inset ring-amber-200 transition-all delay-100"
                        : "ring-none"
                    }

                        ${
                          productEntry?.find((value) =>
                            value.binIdsEntries.includes(bin.id)
                          )
                            ? "bg-emerald-500"
                            : "bg-gray-800"
                        }
                      `}
                  >
                    <td className={tdStyle}>{bin._count.assignedProducts}</td>

                    <td className={tdStyle}>
                      {
                        bin.assignedProducts.map(
                          (assignedProduct) => assignedProduct.products.category
                        )[0]
                      }
                    </td>

                    <td className={tdStyle}>
                      {
                        bin.assignedProducts.map(
                          (assignedProduct) =>
                            assignedProduct.products.productName
                        )[0]
                      }
                    </td>
                    <td className={tdStyle}>
                      {
                        bin.assignedProducts.map(
                          (assignedProduct) => assignedProduct.skuCode
                        )[0]
                      }
                    </td>
                    <td className={tdStyle}>
                      {
                        bin.assignedProducts.map(
                          (assignedProduct) => assignedProduct.products.price
                        )[0]
                      }
                    </td>
                    <td className={tdStyle}>
                      {bin.row}-{bin.shelfLevel}
                    </td>
                  </tr>
                  //   <tr
                  //     onClick={(e) => {
                  //       e.preventDefault();
                  //       selectEntry(bin);
                  //     }}
                  //     key={index}
                  //     className={`text-white transition-all ${
                  //       coveredBins.includes(bin?.id)
                  //         ? "ring-2 ring-inset ring-white transition-all delay-100"
                  //         : "ring-none"
                  //     }

                  //   ${
                  //     productEntry?.find((value) =>
                  //       value.binIdsEntries.includes(bin.id)
                  //     )
                  //       ? "bg-emerald-500"
                  //       : "bg-gray-800"
                  //   }
                  // `}>
                  //     <td className="px-6 py-4">
                  //       {Number(bin?._count.assignedProducts)}
                  //     </td>
                  //     <td className="px-6 py-4">
                  //       {String(bin?.racks?.categories?.category)}
                  //     </td>
                  //     <td className="px-6 py-4">
                  //       {
                  //         bin?.assignedProducts?.map((assign) => {
                  //           return assign?.products?.productName;
                  //         })[0]
                  //       }
                  //     </td>
                  //     <td className="px-6 py-4">
                  //       {
                  //         bin?.assignedProducts?.map((assign) => {
                  //           return Number(assign?.products?.price);
                  //         })[0]
                  //       }
                  //     </td>
                  //     <td className="px-6 py-4">
                  //       {
                  //         bin?.assignedProducts?.map(
                  //           (assign) => assign?.products?.price
                  //         )[0]
                  //       }
                  //     </td>
                  //     <td className="whitespace-nowrap px-6 py-4">
                  //       {bin?.racks?.name} {bin?.row} - {bin?.shelfLevel}
                  //     </td>
                  //   </tr>
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
