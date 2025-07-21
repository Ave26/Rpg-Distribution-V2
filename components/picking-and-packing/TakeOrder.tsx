import React, { useEffect, useMemo, useState } from "react";
import Input from "../Parts/Input";
import useBins, { TBins } from "@/features/picking-and-packing/useBins";
import Loading from "../Parts/Loading";
import { InputStyle } from "@/styles/style";
import { RxCross2 } from "react-icons/rx";

type Items = {
  quantity: number;
  binId: string;
  skuCode: string;
};

type SKUCOde = string;

type QuantityWithBin = {
  binId: string;
  quantity: number;
};

type ColoredBinsBySKU = Record<SKUCOde, QuantityWithBin[]>;

function TakeOrder() {
  const [searchSKU, setSearchSKU] = useState(""); // search barcode
  const { bins, error, isLoading } = useBins(searchSKU);

  const [coloredBinsBySku, setColoredBinsBySku] = useState<ColoredBinsBySKU>(
    {}
  );
  const [quantities, setQuantities] = useState<{ [sku: string]: number }>({});

  const [clientName, setClientName] = useState("");
  const [salesOrder, setSalesOrder] = useState("");
  const [assignTruck, setAssignTruck] = useState<"default" | string>("");
  const [submit, setSubmit] = useState(false);

  const [items, setItems] = useState<Items[]>([]);
  const [itemsTest, setItemsTest] = useState<ColoredBinsBySKU>({});

  // track the max value of bins
  const maxAvailable = useMemo(() => {
    return Array.isArray(bins)
      ? bins.reduce((sum, bin) => sum + bin._count.assignedProducts, 0)
      : 0;
  }, [bins]);

  const ItemsTotalQuantity = useMemo(() => {
    return items
      .filter((item) => item.skuCode === searchSKU)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [items, searchSKU]);

  const remainingAvailable = maxAvailable - ItemsTotalQuantity; //  it retains the quantity because of  items total quantity useState

  useEffect(() => {
    const cappedQuantity = Math.min(quantities[searchSKU] || 0, maxAvailable);
    let runningTotal = 0;

    const updated: QuantityWithBin[] = [];

    for (const bin of bins ?? []) {
      const binQty = bin._count.assignedProducts;

      if (runningTotal >= cappedQuantity) break;

      const remaining = cappedQuantity - runningTotal;
      const taken = Math.min(binQty, remaining);

      updated.push({ binId: bin.id, quantity: taken });
      runningTotal += taken;
    }

    setColoredBinsBySku((prev) => ({
      ...prev,
      [searchSKU]: updated,
    }));
  }, [bins, maxAvailable, quantities, searchSKU]);

  useEffect(() => {
    // Skip if we already have colored bins for this SKU
    if (coloredBinsBySku[searchSKU]) return;

    const cappedQuantity = Math.min(quantities[searchSKU] || 0, maxAvailable);
    let runningTotal = 0;

    const updated: QuantityWithBin[] = [];

    for (const bin of bins ?? []) {
      const binQty = bin._count.assignedProducts;

      if (runningTotal >= cappedQuantity) break;

      const remaining = cappedQuantity - runningTotal;
      const taken = Math.min(binQty, remaining);

      updated.push({ binId: bin.id, quantity: taken });
      runningTotal += taken;
    }

    if (!Object.entries(coloredBinsBySku).every(Boolean)) {
      console.log("this triggered1");
      setColoredBinsBySku({ [searchSKU]: updated });
    } else {
      console.log("this triggered1");
      setColoredBinsBySku((prev) => ({
        ...prev,
        [searchSKU]: updated,
      }));
    }
  }, [bins, maxAvailable, quantities, searchSKU, coloredBinsBySku]);

  /* submit item mock */
  useEffect(() => {
    if (submit) {
      setTimeout(() => {
        setSubmit(false);
      }, 1200);
    }
  }, [submit]);

  /* console log */
  useEffect(() => {
    console.log("coloredBinsBySKU", coloredBinsBySku);
  }, [coloredBinsBySku]);
  useEffect(() => {
    console.log(quantities);
  }, [quantities]);

  const trucks = ["truck1", "truck2", "truck3", "truck4"];
  const binTitles = ["Bin", "Category", "Barcode", "SKU", "Item Name", "Count"];

  /* 
    color bin doesnt get the data of the binId source of where the product is taken

  
  */

  return (
    <section className="grid h-full w-full grid-cols-1 grid-rows-3 gap-1 rounded-lg text-fluid-xxs transition-all md:grid-flow-col md:grid-cols-3 md:grid-rows-2">
      {/* Inputs */}
      <div className="sborder grid grid-cols-2 grid-rows-4 gap-1 rounded-lg bg-white p-2 md:grid-rows-5">
        <div className="col-span-1 rounded-lg border md:col-span-2">
          <Input
            attributes={{
              input: {
                id: "sku",
                value: searchSKU,
                type: "text",
                onChange: (e) => setSearchSKU(e.target.value.toUpperCase()),
              },
              label: { children: "Search SKU", htmlFor: "sku" },
            }}
          />
        </div>
        <div className="col-span-1 rounded-lg border md:col-span-2">
          <Input
            attributes={{
              input: {
                id: "quantity",
                // value: quantity,
                value: quantities[searchSKU] || 0,
                type: "number",
                min: 0,
                max: remainingAvailable || 0,
                disabled: !searchSKU ? true : bins?.length === 0 ? true : false,
                onChange: (e) => {
                  // const value = parseInt(e.target.value, 10) || 0;
                  // if (!isNaN(value)) {
                  //   setQuantity(Math.min(value, remainingAvailable));
                  // }
                  const value = parseInt(e.target.value, 10) || 0;
                  if (!isNaN(value)) {
                    setQuantities((prev) => ({
                      ...prev,
                      [searchSKU]: Math.min(value, remainingAvailable),
                    }));
                  }
                },
              },
              label: { children: "Quantity", htmlFor: "quantity" },
            }}
          />
        </div>

        <div className="col-span-1 rounded-lg border">
          <Input
            attributes={{
              input: {
                id: "clientName",
                value: clientName,
                type: "text",

                disabled: !searchSKU ? true : bins?.length === 0 ? true : false,
                onChange: (e) =>
                  setClientName(e.target.value.toUpperCase().trimEnd()),
              },
              label: { children: "Client", htmlFor: "clientName" },
            }}
          />
        </div>
        <div className="col-span-1 rounded-lg border">
          <Input
            attributes={{
              input: {
                id: "salesOrder",
                value: salesOrder,
                type: "text",
                disabled: !searchSKU ? true : bins?.length === 0 ? true : false,
                onChange: (e) =>
                  setSalesOrder(e.target.value.toUpperCase().trimEnd()),
              },
              label: { children: "Sales Order", htmlFor: "salesOrder" },
            }}
          />
        </div>
        <div className="col-span-1 rounded-lg border">
          <select
            id="assignTruck"
            className={InputStyle}
            value={assignTruck}
            disabled={!searchSKU ? true : bins?.length === 0 ? true : false}
            onChange={(e) =>
              setAssignTruck(e.target.value.toUpperCase().trimEnd())
            }
          >
            <option value="default" disabled hidden>
              Assign Truck
            </option>
            {trucks.map((truck, i) => (
              <option key={i} value={truck}>
                {truck}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1 row-span-1 rounded-lg border">
          <select
            id="assignTruck"
            className={InputStyle}
            value={assignTruck}
            disabled={!searchSKU ? true : bins?.length === 0 ? true : false}
            onChange={(e) =>
              setAssignTruck(e.target.value.toUpperCase().trimEnd())
            }
          >
            <option value="default" disabled hidden>
              Assign Truck
            </option>
            {trucks.map((truck, i) => (
              <option key={i} value={truck}>
                {truck}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={quantities[searchSKU] === 0 || remainingAvailable === 0}
          onClick={() => {
            const currentQuantity = quantities[searchSKU] || 0;

            setItems((prev) => {
              const existingItem = prev.find(
                (item) => item.skuCode === searchSKU
              );

              if (existingItem) {
                return prev.map((item) =>
                  item.skuCode === searchSKU
                    ? { ...item, quantity: item.quantity + currentQuantity }
                    : item
                );
              } else {
                return [
                  ...prev,
                  { binId: "", quantity: currentQuantity, skuCode: searchSKU },
                ];
              }
            });

            // the only thing I reset

            setQuantities((prev) => ({ ...prev, [searchSKU]: 0 }));
            setSearchSKU("");
            setColoredBinsBySku({});
            // setClientName("");
            // setSalesOrder("");
            // setAssignTruck("default");
          }}
          className="col-span-2 row-span-1 rounded-lg border bg-slate-400 font-bold uppercase text-slate-100 hover:bg-amber-400 md:row-start-5"
        >
          Move to Queue List
        </button>
      </div>

      {/* Ordered Items */}
      <div className="flex grid-cols-1 flex-col rounded-lg bg-white p-2">
        <div className="flex h-full flex-col items-start justify-start gap-1 overflow-x-hidden overflow-y-scroll rounded-lg p-1">
          {submit ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : (
            items.map(({ binId, quantity, skuCode }, index) => {
              return (
                <div
                  key={index}
                  className="flex h-fit w-full items-center justify-between gap-1 rounded-lg border p-1"
                >
                  <ul className="flex items-center justify-center gap-1 rounded-lg font-semibold uppercase">
                    <li className="h-full rounded-lg  p-1">
                      Quantity: {quantity}
                    </li>
                    <li className="h-full rounded-lg  p-1">SKU: {skuCode}</li>
                  </ul>

                  <button
                    disabled={remainingAvailable <= 0}
                    onClick={() => {
                      setItems((prev) => {
                        console.log(prev);
                        return prev.filter((_, i) => i !== index);
                      });
                    }}
                    className="rounded-lg border p-2"
                  >
                    <RxCross2 className="" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex w-full items-center justify-center">
          <button
            onClick={() => {
              setSubmit(true);
            }}
            className="h-8 w-full rounded-lg border bg-slate-500 font-bold uppercase text-slate-100 hover:bg-amber-500 md:h-11"
          >
            Submit List
          </button>
          <button
            onClick={() => {
              setItems([]);
              setColoredBinsBySku({});
            }}
            className="h-8  w-1/4 rounded-lg border bg-red-400 font-bold uppercase text-slate-100 hover:bg-amber-400 md:h-11"
          >
            Clear List
          </button>
        </div>
      </div>

      {/* table */}
      <div className="flex h-full w-full flex-col items-start justify-start overflow-auto rounded-lg scrollbar-track-rounded-lg md:col-span-2 md:row-span-4 md:w-full md:overflow-x-hidden md:overflow-y-scroll">
        <div className="sticky top-0 flex w-full gap-1 rounded-lg rounded-b-none bg-slate-400 p-1 font-semibold uppercase">
          {binTitles.map((title) => {
            return (
              <h1
                key={title}
                className="flex w-full items-center justify-center rounded-lg border text-center"
              >
                {title}
              </h1>
            );
          })}
        </div>
        {Array.isArray(bins) ? (
          bins.map((bin, index) => {
            // console.log("this will rerender everytime the bin changes");

            const allColoredBins = Object.entries(coloredBinsBySku).flatMap(
              ([_, bins]) => bins
            );
            // console.log(allColoredBins);
            const match = allColoredBins.find((v) => v.binId === bin.id);

            const bgColor = match
              ? match.quantity < bin._count.assignedProducts
                ? "bg-orange-400/50" // Not enough, partial fill
                : "bg-blue-400/50" // Fully filled
              : "bg-white"; // Not selected

            return (
              <ul
                key={index}
                className={`  ${bgColor}
              flex h-fit w-full items-center justify-center  gap-1 break-all p-1 uppercase hover:bg-amber-300/70`}
              >
                <li className="flex h-full w-full items-center justify-center border">
                  Bin{bin.row}-{bin.shelfLevel}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {bin.category}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {bin.assignedProducts[0].barcodeId}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {bin.assignedProducts[0].skuCode}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {bin.assignedProducts[0].products.productName}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {bin._count.assignedProducts}
                </li>
              </ul>
            );
          })
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </section>
  );
}

export default TakeOrder;

type Bins = TBins & {
  isHighlighted: boolean;
};

interface BinTableProps {
  bins: Bins[];
}
// function BinTable({ bins }: BinTableProps) {
//   console.log(bins);
//   return (
//     <>
//       {bins.map((bin, index) => {
//         const allColoredBins = Object.entries(coloredBinsBySku).flatMap(
//           ([_, bins]) => bins
//         );
//         console.log(allColoredBins);
//         const match = allColoredBins.find((v) => v.binId === bin.id);

//         const bgColor = match
//           ? match.quantity < bin._count.assignedProducts
//             ? "bg-orange-400/50" // Not enough, partial fill
//             : "bg-blue-400/50" // Fully filled
//           : "bg-white"; // Not selected

//         return (
//           <ul
//             key={index}
//             className={`  ${bgColor}
//               flex h-fit w-full items-center justify-center  gap-1 break-all p-1 uppercase hover:bg-amber-300/70`}
//           >
//             <li className="flex h-full w-full items-center justify-center border">
//               Bin{bin.row}-{bin.shelfLevel}
//             </li>
//             <li className="flex h-full w-full items-center justify-center border">
//               {bin.category}
//             </li>
//             <li className="flex h-full w-full items-center justify-center border">
//               {bin.assignedProducts[0].barcodeId}
//             </li>
//             <li className="flex h-full w-full items-center justify-center border">
//               {bin.assignedProducts[0].skuCode}
//             </li>
//             <li className="flex h-full w-full items-center justify-center border">
//               {bin.assignedProducts[0].products.productName}
//             </li>
//             <li className="flex h-full w-full items-center justify-center border">
//               {bin._count.assignedProducts}
//             </li>
//           </ul>
//         );
//       })}
//     </>
//   );
// }
