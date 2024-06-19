import { TBins } from "@/fetcher/fetchBins";

import React, { useEffect, useRef, useState } from "react";
import AssignedProductDetails from "./AssignedProductDetails";
import {
  TBinLocation,
  TBinLocations,
  TCreateOrderedProduct,
  TOrderedProducts,
} from "./Admin";
import { buttonStyleEdge } from "@/styles/style";
import { TToast } from "../Toast";
import { checkError } from "@/helper/_helper";
import { TRecord } from "./AdminRecordForm";

type TInventoryView = {
  states: TStates;
};

export type TStates = {
  total: number;
  toast: TToast;
  bins: TBins[] | undefined;
  binLocation: TBinLocation;
  binLocations: TBinLocations[];
  orderedProducts: TCreateOrderedProduct[];
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  setBinLocation: React.Dispatch<React.SetStateAction<TBinLocation>>;
  setBinLocations: React.Dispatch<React.SetStateAction<TBinLocations[]>>;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled: boolean;
  setOrderedProducts: React.Dispatch<
    React.SetStateAction<TCreateOrderedProduct[]>
  >;
  record: TRecord;
};

type TStruck = "FILTER" | "INSERT" | "ADD" | undefined;

export default function InventoryView({ states }: TInventoryView) {
  const { setOrderedProducts, orderedProducts, binLocation, setToast, record } =
    states;
  const [threshold, setThreshold] = useState(binLocation.totalQuantity);

  useEffect(() => {
    setThreshold(binLocation.totalQuantity);
  }, [binLocation.totalQuantity]);

  // useEffect(() => {
  //   console.log("orderedProducts", JSON.stringify(orderedProducts, null, 2));
  // }, [orderedProducts]);

  // useEffect(() => {
  //   console.log("threshold", threshold);
  // }, [threshold]);

  function findIndex(value: string) {
    const existingProductIndex = orderedProducts.findIndex(
      (product) => product.productName === value
    );
    return { existingProductIndex };
  }

  function handleBinSelection(value: TBins) {
    checkError(states.binLocation, states.setToast);
    const binId = value.id;
    const skuCode = value.assignedProducts[0].skuCode;
    const productName = value.assignedProducts[0].products.productName;
    const count = Math.min(threshold, value._count.assignedProducts);
    const { existingProductIndex } = findIndex(productName);
    let quantityPocket: number = 0;
    const orderedProductsExists = existingProductIndex !== -1;

    if (orderedProductsExists) {
      const binLocationIndex = orderedProducts[
        existingProductIndex
      ].binLocations.createMany.data.findIndex(
        (binLocation) => binLocation.binId === binId
      );

      const binLocationExists = binLocationIndex !== -1;
      if (binLocationExists) {
        // FILTER
        setOrderedProducts((prevState) => {
          const updatedProducts = [...prevState];

          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            binLocations: {
              createMany: {
                data: updatedProducts[
                  existingProductIndex
                ].binLocations.createMany.data.filter((bin) => {
                  if (bin.binId === binId) {
                    quantityPocket = bin.quantity;
                  }

                  return bin.binId !== binId;
                }),
              },
            },
          };

          if (
            updatedProducts[existingProductIndex].binLocations.createMany.data
              .length === 0
          ) {
            // If so, remove the entire product
            states.setIsDisabled(false);
            updatedProducts.splice(existingProductIndex, 1);
          }

          return updatedProducts;
        });

        return setThreshold((prevState) => prevState + quantityPocket);
      }
      // INSERT
      setThreshold((prevState) => prevState - count);
      setOrderedProducts((prevState) => {
        const updatedProducts = [...prevState];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          binLocations: {
            createMany: {
              data: [
                ...updatedProducts[existingProductIndex].binLocations.createMany
                  .data,
                {
                  binId,
                  quantity: count,
                  skuCode,
                },
              ],
            },
          },
        };

        return updatedProducts;
      });
    } else {
      // ADD
      states.setIsDisabled(true);
      setOrderedProducts((prevState) => [
        ...prevState,
        {
          productName,
          binLocations: {
            createMany: {
              data: [{ binId, quantity: count, skuCode }],
            },
          },
        },
      ]);
      return setThreshold((prevState) => prevState - count);
    }

    console.log("count", count);
    console.log("pocket", quantityPocket);
  }

  return (
    <div className="relative flex h-72 w-full flex-col gap-[1.5px] overflow-y-scroll rounded-md border border-slate-200 bg-white p-2 text-center shadow-md transition-all md:h-full">
      {Array.isArray(states.bins) &&
        states.bins.map((bin, index) => {
          const binId = bin.id;
          const isExists = states.orderedProducts.some((product) =>
            product.binLocations.createMany.data.some(
              (bin) => bin.binId === binId
            )
          );
          return (
            <React.Fragment key={bin.id}>
              <div
                onClick={() => {
                  const isExists = states.orderedProducts.some((product) =>
                    product.binLocations.createMany.data.some(
                      (bin) => bin.binId === binId
                    )
                  );

                  const hasValue = Object.values(record).every(Boolean);

                  if (
                    (states.binLocation.searchSKU &&
                      states.binLocation.totalQuantity &&
                      isExists) ||
                    hasValue
                  ) {
                    handleBinSelection(bin);
                  } else {
                    setToast({
                      animate: "animate-emerge",
                      door: true,
                      message: "Incomplete Field",
                    });
                  }
                }}
                className={`${
                  isExists && "bg-sky-400/30"
                } text-xshover:bg-transparent flex select-none flex-wrap justify-between rounded-md border border-slate-400/25 hover:border-slate-400/50 active:bg-slate-300/50 md:flex-nowrap md:whitespace-nowrap`}
              >
                <h1 className="flex items-center justify-center p-2">
                  BIN {bin.row}-{bin.shelfLevel}
                </h1>
                {bin.assignedProducts?.map((assignedProduct, index) => {
                  return (
                    <AssignedProductDetails
                      key={index}
                      assignedProduct={assignedProduct}
                    />
                  );
                })}

                <h1 className="flex items-center justify-center p-2">
                  Count: {bin._count.assignedProducts}
                </h1>
              </div>
            </React.Fragment>
          );
        })}

      <button
        className={`${buttonStyleEdge} sticky bottom-0 left-0 m-2 md:absolute`}
      >
        Reset
      </button>
    </div>
  );
}
