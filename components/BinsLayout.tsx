import React, { SetStateAction, useEffect, useState } from "react";
import { Bin } from "@/types/inventory";
import { EntriesTypes, dataEntriesTypes } from "@/types/binEntries";

interface BinsProps {
  dataManipulator?: BinsType;
  isLoading: boolean;
  request: RequestTypes;
  setRequest: SetRequestTypes;
  dataEntries: dataEntriesTypes;
}

interface BinsType {
  bins?: Bin[] | undefined;
  handleMutation: () => void;
}

interface SetRequestTypes {
  setSelectedBinIds: React.Dispatch<SetStateAction<string[]>>;
}

interface RequestTypes {
  quantity: number;
  barcodeId: string;
  selectedBinIds: string[];
}

export default function BinsLayout({
  dataManipulator,
  isLoading,
  request,
  setRequest,
  dataEntries,
}: BinsProps) {
  const [coveredBins, setCoverdBins] = useState<String[]>([]);
  const { productEntry, setProductEntry } = dataEntries;
  const { setSelectedBinIds } = setRequest;
  const { selectedBinIds } = request;
  const titles = [
    "Quantity",
    "Product Category",
    "Product Name",
    "Product SKU",
    "Price",
    "Bin",
  ];

  // function selectBin(binId: string) {
  //   if (selectedBinIds.includes(binId)) {
  //     setSelectedBinIds(selectedBinIds.filter((id) => id !== binId));
  //   } else {
  //     setSelectedBinIds([...selectedBinIds, binId]);
  //   }
  // }

  function selectEntry(bin: Bin) {
    const { totalQuantity, productName, barcodeId, binId } =
      take_only_the_necessary_value(bin);

    const isExisted =
      productEntry?.find(
        (existingEntry) => existingEntry.barcodeId === barcodeId
      ) !== undefined;

    let newEntry: EntriesTypes = {
      totalQuantity,
      productName,
      barcodeId,
      binIdsEntries: [binId],
    };

    if (isExisted) {
      setProductEntry(
        productEntry.map((entry) => {
          return entry.barcodeId === barcodeId &&
            !entry.binIdsEntries.includes(binId)
            ? { ...entry, binIdsEntries: [...entry.binIdsEntries, binId] }
            : entry;
        })
      );
    } else {
      productEntry && setProductEntry([...productEntry, newEntry]);
    }
  }

  const take_only_the_necessary_value = (bin: Bin) => {
    const totalQuantity = bin._count.assignment;
    const productName = bin.assignment[0].products.productName;
    const barcodeId = bin.assignment[0].products.barcodeId;
    const binId = bin.id;

    return { totalQuantity, productName, barcodeId, binId };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const threshold = request.quantity;
      let negatedThreshold = threshold;
      const coveredBin = [];

      const bins = dataManipulator?.bins;
      if (bins) {
        for (let bin of bins) {
          const binCount = bin._count.assignment;
          // console.log("bin count:", binCount);
          if (negatedThreshold <= 0) {
            break;
          }
          negatedThreshold -= binCount;
          coveredBin.push(bin?.id);
          console.log("negated:", negatedThreshold);
        }
        // console.log("cover bin id:", JSON.stringify(coveredBin));
        setCoverdBins(coveredBin); // Update the state with the final value
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [request.quantity]);

  return (
    <div className="h-full w-full select-none overflow-y-auto rounded-t-md border md:h-[25em] md:max-h-[25em] md:min-w-0 md:max-w-[45em]">
      <table className="rounded-t-md  text-left text-sm text-gray-500 dark:text-gray-400">
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
          {dataManipulator?.bins?.map((bin: Bin, index) => {
            return (
              <tr
                onClick={(e) => {
                  e.preventDefault();
                  selectEntry(bin);
                  // selectBin(bin?.id);
                }}
                key={index}
                className={`text-white transition-all ${
                  coveredBins.includes(bin?.id)
                    ? "ring-2 ring-inset ring-white transition-all delay-100"
                    : "ring-none"
                } ${
                  selectedBinIds.includes(bin?.id)
                    ? "bg-emerald-500"
                    : "bg-gray-800"
                }`}>
                <td className="px-6 py-4">{Number(bin?._count?.assignment)}</td>
                <td className="px-6 py-4">
                  {String(bin?.racks?.categories?.category)}
                </td>
                <td className="px-6 py-4">
                  {
                    bin?.assignment?.map((assign) => {
                      return assign?.products?.productName;
                    })[0]
                  }
                </td>
                <td className="px-6 py-4">
                  {
                    bin?.assignment?.map((assign) => {
                      return assign?.products?.price;
                    })[0]
                  }
                </td>
                <td className="px-6 py-4">
                  {bin?.assignment?.map((assign) => assign?.products?.price)[0]}
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
    </div>
  );
}

/**
  type BucketEntryTypes = {
    totalQuantity: number,
    binIdEntries: string[]
  }
 */

// SELECTED BINS

// IT WILL GO TO THE PLACEHOLDER
// IF THE BINIDS ARE THESAME IT WILL MERGE OTHERWISE
// IT WILL PUSH OR CREATE A NEW ENTRY

// PER NEW ENTRY QUANTITY WILL BE BASED ON THE USER'S
// INPUT

// BODY OF ENTRY {QUANTITY: NUMBER, BINID: [1,2,3]}
