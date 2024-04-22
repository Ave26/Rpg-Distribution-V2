import { TBins } from "@/fetcher/fetchProducts";

import React, { useEffect, useState } from "react";
import AssignedProductDetails from "./AssignedProductDetails";
import {
  TBinLocation,
  TBinLocations,
  TCreateOrderedProduct,
  TOrderedProducts,
} from "./Admin";
import { buttonStyleEdge } from "@/styles/style";
import { TToast } from "../Toast";

type TInventoryView = {
  states: TStates;
};

type TStates = {
  total: number;
  toast: TToast;
  selectable: boolean;
  bins: TBins[] | undefined;
  binLocation: TBinLocation;
  binLocations: TBinLocations[];
  orderedProducts: TCreateOrderedProduct[];
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
  setBinLocation: React.Dispatch<React.SetStateAction<TBinLocation>>;
  setBinLocations: React.Dispatch<React.SetStateAction<TBinLocations[]>>;
  setOrderedProducts: React.Dispatch<
    React.SetStateAction<TCreateOrderedProduct[]>
  >;
};

export default function InventoryView({ states }: TInventoryView) {
  const { setOrderedProducts, orderedProducts } = states;
  const [threshold, setThreshold] = useState(0);

  // useEffect(() => {
  //   console.log("threshold", threshold);
  // }, [threshold]);

  useEffect(() => {
    setThreshold(states.binLocation.totalQuantity);
  }, [states.binLocation.totalQuantity]);

  function checkError() {
    !states.binLocation.searchSKU &&
      states.setToast({
        animate: "animate-emerge",
        door: true,
        message: "Empty Filled for search SKU and quantity",
      });
  }

  // function negate(value: TBins) {
  //   const binCount = value._count.assignedProducts;
  //   const count = Math.min(threshold, binCount);
  //   setThreshold(threshold - count);
  //   return count;
  // }

  function validateBinSelection(value: TBins) {
    const hasValue = states.binLocations.find((binLocation) => {
      binLocation.binId === value.id &&
        setThreshold(threshold + binLocation.quantity);
      return binLocation.binId === value.id;
    });

    const isValid =
      !states.selectable ||
      !states.binLocation.searchSKU ||
      !states.binLocation.totalQuantity ||
      hasValue ||
      threshold === 0;

    return isValid
      ? states.setBinLocations(
          states.binLocations.filter((bin) => {
            return bin.binId !== value.id;
          })
        )
      : states.setBinLocations([
          ...states.binLocations,
          {
            binId: value.id,
            quantity: 0,
            skuCode: value.assignedProducts[0].skuCode,
          },
        ]);
  }

  function handleBinSelection(value: TBins) {
    const binId = value.id;
    const skuCode = value.assignedProducts[0].skuCode;
    const productName = value.assignedProducts[0].products.productName;

    const existingProductIndex = orderedProducts.findIndex(
      (product) => product.productName === productName
    );

    if (existingProductIndex !== -1) {
      setOrderedProducts((prevOrderedProduct) => {
        const updatedProducts = [...prevOrderedProduct];

        const getBinLocationIndex = updatedProducts[
          existingProductIndex
        ].binLocations.createMany.data.findIndex((bin) => {
          bin.binId === value.id && setThreshold(threshold + bin.quantity);
          return bin.binId === binId;
        });

        if (getBinLocationIndex !== -1) {
          console.log("filtering binLocation...");

          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            binLocations: {
              createMany: {
                data: updatedProducts[
                  existingProductIndex
                ].binLocations.createMany.data.filter(
                  (bin) => bin.binId !== binId
                ),
              },
            },
          };
          if (
            updatedProducts[existingProductIndex].binLocations.createMany.data
              .length === 0
          ) {
            updatedProducts.splice(existingProductIndex, 1);
          }
        } else {
          console.log("adding binLocation...");

          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            binLocations: {
              createMany: {
                data: [
                  ...updatedProducts[existingProductIndex].binLocations
                    .createMany.data,
                  {
                    binId,
                    quantity: 0,
                    skuCode,
                  },
                ],
              },
            },
          };
        }

        return updatedProducts;
      });
    } else {
      console.log("create new");
      setOrderedProducts((prevState) => [
        ...prevState,
        {
          productName,
          binLocations: {
            createMany: {
              data: [{ binId, quantity: 0, skuCode }],
            },
          },
        },
      ]);
    }

    // checkError();
    // validateBinSelection(value);
  }

  return (
    <div className="relative flex h-72 w-full flex-col gap-[1.5px] overflow-y-scroll rounded-md border border-slate-200 p-2 text-center shadow-md transition-all md:h-full">
      {Array.isArray(states.bins) &&
        states.bins.map((bin) => {
          return (
            <React.Fragment key={bin.id}>
              <div
                onClick={() => {
                  handleBinSelection(bin);
                }}
                className={`${
                  states.binLocations.find(
                    (binLocation) => binLocation.binId === bin.id
                  ) && "bg-sky-400/30"
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

/* 
   highlight the selected product 
    make a hightlited border based on the total quantity
    reduce the array count to get the total count
    TODO: delete the selected id in the array if its already bin there

       SEARCH PRODUCT USING SKU CODE

    TODO:
      - if the bin data array is empty then remove the ordered product
      - Need to negate quantity
      - find out where the setQuantity will be executed 
  


   
.*/

// useEffect(() => {
//   const totalQuantity = Array.isArray(bins)
//     ? bins.reduce((accumulator, initial: TBins) => {
//         return accumulator + initial._count.assignedProducts;
//       }, 0)
//     : 0;
//   console.log(totalQuantity);
//   return setTotal(totalQuantity);
// }, [binLocation.totalQuantity]);

// useEffect(() => {
//   console.log("total", total);
// }, [binLocation.totalQuantity, total]);
