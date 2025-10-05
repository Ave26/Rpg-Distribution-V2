import React, { useEffect, useMemo, useState } from "react";
import Input from "../Parts/Input";
import useBins, { TBins } from "@/features/picking-and-packing/useBins";
import Loading from "../Parts/Loading";
import { InputStyle } from "@/styles/style";
import { RxCross2 } from "react-icons/rx";
import { mutate } from "swr";
import { Prisma } from "@prisma/client";

export type QuantityWBinID = {
  [skuCode: string]: {
    [binId: string]: number;
  };
};

type TItems = {
  sku: string;
  count: number;
};

interface CommonStates {
  searchSKU: string;
  items: TItems[];
  bins: TBins[] | undefined;
}

interface AssignTruckProps {
  states: CommonStates & {
    truckName: string;
    setTruckName: React.Dispatch<React.SetStateAction<string>>;

    truckId: string;
    setTruckId: React.Dispatch<React.SetStateAction<string>>;
  };
}

interface AssignLocationProps {
  states: CommonStates & {
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;

    locationId: string;
    setLocationId: React.Dispatch<React.SetStateAction<string>>;
  };
}

function TakeOrder() {
  const [searchSKU, setSearchSKU] = useState("");
  const { bins } = useBins(searchSKU);
  const [quantities, setQuantities] = useState<{ [sku: string]: number }>({}); // total value of specific product in bins
  const [orders, setOrders] = useState<QuantityWBinID>({});

  const [clientName, setClientName] = useState("");
  const [salesOrder, setSalesOrder] = useState("");
  const [truckName, setTruckName] = useState("default");
  const [location, setLocation] = useState("default");
  const [items, setItems] = useState<TItems[]>([]);

  const [openAlert, setOpenAlert] = useState(false);

  const [truckId, setTruckId] = useState("default");
  const [locationId, setLocationId] = useState("default");

  const [submit, setSubmit] = useState(false);

  const totalNumberOfSpecificProduct = useMemo(() => {
    if (!searchSKU) return 0;

    return Array.isArray(bins)
      ? bins.reduce((acc, initial) => {
          return initial._count.assignedProducts + acc;
        }, 0)
      : 0;
  }, [bins, searchSKU]);

  const binTitles = ["BIN", "CATEGORY", "BARCODE", "SKU", "ITEM NAME", "COUNT"];

  useEffect(() => {
    if (!openAlert) return;

    const timer = setTimeout(() => {
      setOpenAlert(false);
    }, 1000);

    return () => clearTimeout(timer); // ✅ cleanup
  }, [openAlert]);

  useEffect(() => {
    console.log({ orders, clientName, location, salesOrder, truckName });
  }, [orders, clientName, location, salesOrder, truckName]);

  useEffect(() => {
    console.log("items", items);
  }, [items]);

  return (
    <section className="grid h-full w-full grid-cols-1 grid-rows-3 gap-1 rounded-lg text-fluid-xxs transition-all md:grid-flow-col md:grid-cols-4 md:grid-rows-2">
      {/* Inputs */}
      <div className="grid grid-cols-2 grid-rows-4 gap-1 rounded-lg border bg-white p-2 md:grid-rows-5">
        {/* search sku */}
        <div className="col-span-1 rounded-lg border md:col-span-2">
          <Input
            attributes={{
              input: {
                id: "sku",
                value: searchSKU,
                type: "text",
                onChange: (e) => {
                  setSearchSKU(e.target.value.toUpperCase().trim());
                },
              },
              label: { children: "Search SKU", htmlFor: "sku" },
            }}
          />
        </div>
        {/* quantity */}
        <div className="col-span-1 rounded-lg border md:col-span-2">
          <Input
            attributes={{
              input: {
                id: "quantity",
                value: quantities[searchSKU] || 0,
                type: "number",
                min: 0,
                max: totalNumberOfSpecificProduct ?? 0,
                disabled: !searchSKU ? true : bins?.length === 0 ? true : false,
                onChange: (e) => {
                  const value = parseInt(e.target.value, 10); // we have the fresh value

                  if (!bins) return;

                  let val = value;
                  let newAllocations: Record<string, number> = {};

                  for (const bin of Array.isArray(bins) ? bins : []) {
                    if (val <= 0) break; // <-- only this can stop looping

                    const binQTY = bin._count.assignedProducts;
                    const allocate = Math.min(binQTY, val);

                    if (allocate > 0) {
                      newAllocations[bin.id] = allocate;
                      val -= allocate;
                    }
                  }
                  setOrders((prev) => {
                    if (Object.keys(newAllocations).length === 0) {
                      const { [searchSKU]: _, ...rest } = prev;
                      return rest;
                    }

                    return {
                      ...prev,
                      [searchSKU]: newAllocations,
                    };
                  });

                  setQuantities((prev) => ({
                    ...prev,
                    [searchSKU]: Math.min(
                      isNaN(value) ? 0 : parseInt(e.target.value, 10),
                      totalNumberOfSpecificProduct
                    ),
                  }));
                },
              },
              label: { children: "Quantity", htmlFor: "quantity" },
            }}
          />
        </div>
        {/* client name */}
        <div className="col-span-1 rounded-lg border">
          <Input
            attributes={{
              input: {
                id: "clientName",
                value: clientName,
                type: "text",

                disabled:
                  !searchSKU || items.length != 0
                    ? true
                    : bins?.length === 0
                    ? true
                    : false,
                onChange: (e) =>
                  setClientName(e.target.value.toUpperCase().trimEnd()),
              },
              label: { children: "Client", htmlFor: "clientName" },
            }}
          />
        </div>
        {/* sales order */}
        <div className="col-span-1 rounded-lg border">
          <Input
            attributes={{
              input: {
                id: "salesOrder",
                value: salesOrder,
                type: "text",
                disabled:
                  !searchSKU || items.length != 0
                    ? true
                    : bins?.length === 0
                    ? true
                    : false,
                onChange: (e) =>
                  setSalesOrder(e.target.value.toUpperCase().trimEnd()),
              },
              label: { children: "Sales Order", htmlFor: "salesOrder" },
            }}
          />
        </div>
        <AssignTruck
          states={{
            bins,
            items,
            searchSKU,
            setTruckName,
            truckName,
            setTruckId,
            truckId,
          }}
        />
        <AssignLocation
          states={{
            bins,
            items,
            searchSKU,
            location,
            setLocation,
            locationId,
            setLocationId,
          }}
        />

        <button
          disabled={totalNumberOfSpecificProduct === 0}
          onClick={() => {
            const currentQuantity = quantities[searchSKU] || 0;

            if (!clientName || !salesOrder) return setOpenAlert(true);
            // transform the orders into items that can be display

            const newOrders = Object.entries(orders).map(
              ([sku, binIdWCount]) => {
                const count = Object.values(binIdWCount).reduce(
                  (acc, initial) => {
                    console.log(initial);
                    return acc + initial;
                  },
                  0
                );

                return { sku, count };
              }
            );

            console.log(newOrders);
            setItems(newOrders);
            setSearchSKU("");
            // setQuantities((v) => ({ ...v, [searchSKU]: 0 }));
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
            items.map(({ count, sku }, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    sku === searchSKU && "border-orange-400"
                  } flex h-fit w-full items-center justify-between gap-1 rounded-lg border p-1`}
                >
                  <ul className="flex items-center justify-center gap-1 rounded-lg font-semibold uppercase">
                    <li className="h-full rounded-lg  p-1">
                      Quantity: {count}
                    </li>
                    <li className="h-full rounded-lg  p-1">SKU: {sku}</li>
                  </ul>

                  <button
                    onClick={() => {
                      setItems((prev) => {
                        return prev.filter((_, i) => i !== index);
                      });

                      setOrders((prev) => {
                        const { [sku]: _, ...rest } = prev;
                        return rest;
                      });

                      setQuantities((prev) => {
                        const { [sku]: _, ...rest } = prev;
                        return rest;
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
              fetch("/api/picking-and-packing/take-orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orders,
                  clientName,
                  salesOrder,
                  locationId,
                  truckId,
                }),
              })
                .then(async (res) => {
                  const data = await res.json();
                  console.log(data);
                })
                .catch((e) => console.log(e))
                .finally(() => {
                  mutate("/api/order/bins");
                  setSearchSKU("");
                  setOrders({});
                  setQuantities({});
                  setItems([]);
                  setSubmit(false);
                });
            }}
            className="h-8 w-full rounded-lg border bg-slate-500 font-bold uppercase text-slate-100 hover:bg-amber-500 md:h-11"
          >
            Submit List
          </button>
          <button
            onClick={() => {
              setSearchSKU("");
              setOrders({});
              setQuantities({});
              setItems([]);
              setClientName("");
              setSalesOrder("");
            }}
            className="h-8  w-1/4 rounded-lg border bg-red-400 font-bold uppercase text-slate-100 hover:bg-amber-400 md:h-11"
          >
            Clear List
          </button>
        </div>
      </div>

      {/* table */}
      <div className="flex h-full w-full grid-cols-1 flex-col items-start justify-start overflow-auto rounded-lg bg-white scrollbar-track-rounded-lg md:col-span-4 md:row-span-2 md:w-full md:overflow-x-hidden md:overflow-y-scroll">
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
          bins.map((bin) => {
            const qty = Object.values(orders).reduce((sum, bins) => {
              return sum + (bins[bin.id] ?? 0);
            }, 0);
            const newQuantity = Math.min(
              bin._count.assignedProducts,
              bin._count.assignedProducts - qty
            );

            const bgColor = newQuantity
              ? newQuantity < bin._count.assignedProducts
                ? "bg-orange-400/50" // Not enough, partial fill
                : "bg-white" // Fully filled
              : "bg-blue-400/50"; // Not selected  ${bgColor}

            return (
              <ul
                key={bin.id}
                className={` ${bgColor}
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
                <li className="flex h-full w-full items-center justify-center border font-extrabold">
                  {/* {bin._count.assignedProducts} */}

                  {newQuantity}
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
      <div className="absolute bottom-5 right-5">
        {openAlert && <AlertButton />}
      </div>
    </section>
  );
}

export default TakeOrder;

function AlertButton() {
  return (
    <div
      id="toast-danger"
      className="mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400"
      role="alert"
    >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span className="sr-only">Error icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">
        Please Complete Empty Fields.
      </div>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
        data-dismiss-target="#toast-danger"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}

function AssignTruck({ states }: AssignTruckProps) {
  const {
    bins,
    items,
    searchSKU,
    truckName,
    setTruckName,
    truckId,
    setTruckId,
  } = states;
  type trucks = Prisma.trucksGetPayload<{
    select: { truckName: true; id: true; payloadCapacity: true };
  }>;

  const [isFetch, setIsFetch] = useState(false);
  const [trucks, setTrucks] = useState<trucks[]>([]);
  // const [assignTruck, setAssignTruck] = useState("");

  useEffect(() => {
    if (!isFetch) return;
    fetch("/api/trucks/find", {
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const data: trucks[] = await res.json();
        setTrucks(data);
      })
      .catch((er) => er)
      .finally(() => setIsFetch(false));

    return setIsFetch(false);
  }, [isFetch]);

  return (
    <select
      id="assignTruck"
      className={InputStyle}
      value={truckId}
      disabled={
        !searchSKU || items.length != 0
          ? true
          : bins?.length === 0
          ? true
          : false
      }
      onFocus={() => setIsFetch(true)}
      onChange={(e) => setTruckId(e.target.value.toUpperCase().trimEnd())}
    >
      <option value="default" disabled hidden>
        ASSIGN TRUCK
      </option>

      {trucks.length > 0 &&
        trucks.map(({ truckName, id, payloadCapacity }) => (
          <option key={id} value={id}>
            {`${truckName}, ${payloadCapacity}`}
          </option>
        ))}
    </select>
  );
}

function AssignLocation({ states }: AssignLocationProps) {
  const {
    bins,
    items,
    searchSKU,
    location,
    setLocation,
    locationId,
    setLocationId,
  } = states;
  type locations = Prisma.locationsGetPayload<{
    select: { name: true; id: true };
  }>;

  const [isFetch, setIsFetch] = useState(false);
  const [locations, setLocations] = useState<locations[]>([]);
  // const [locationId, setLocationId] = useState("");
  // const [assignLocation, setAssignLocation] = useState("");

  useEffect(() => {
    if (!isFetch) return;
    fetch("/api/location/find", {
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const data: locations[] = await res.json();
        console.log(data);
        setLocations(data);
      })
      .catch((er) => er)
      .finally(() => setIsFetch(false));

    return setIsFetch(false);
  }, [isFetch]);

  return (
    <select
      id="assignLocation"
      className={InputStyle}
      value={locationId}
      disabled={
        !searchSKU || items.length != 0
          ? true
          : bins?.length === 0
          ? true
          : false
      }
      onFocus={() => setIsFetch(true)}
      onChange={(e) => setLocationId(e.target.value)}
    >
      <option value="default" disabled hidden>
        ASSIGN LOCATION
      </option>

      {locations.length > 0 &&
        locations.map(({ name, id }, i) => (
          <option key={i} value={id}>
            {name}
          </option>
        ))}
    </select>
  );
}

//  <div className="col-span-1 rounded-lg border">
//           <select
//             id="assignTruck"
//             className={InputStyle}
//             value={assignTruck}
//             disabled={
//               !searchSKU || items.length != 0
//                 ? true
//                 : bins?.length === 0
//                 ? true
//                 : false
//             }
//             onFocus={() => {
//               const test = 12;
//               console.log(() => {});
//             }}
//             onChange={(e) =>
//               setAssignTruck(e.target.value.toUpperCase().trimEnd())
//             }
//           >
//             <option value="default" disabled hidden>
//               Assign Truck
//             </option>

//             {/* {Array.isArray(trucks) &&
//               trucks?.map((truck, i) => (
//                 <option key={i} value={truck.truckName}>
//                   {truck.truckName}
//                 </option>
//               ))} */}
//           </select>
//         </div>

//  <div className="col-span-1 row-span-1 rounded-lg border">
//       <select
//         id="assignTruck"
//         className={InputStyle}
//         value={assignTruck}
//         disabled={
//           !searchSKU || items.length != 0
//             ? true
//             : bins?.length === 0
//             ? true
//             : false
//         }
//         onChange={(e) =>
//           setAssignTruck(e.target.value.toUpperCase().trimEnd())
//         }
//       >
//         <option value="default" disabled hidden>
//           Assign Truck
//         </option>
//         {/* {Array.isArray(trucks) &&
//           trucks?.map((truck, i) => (
//             <option key={i} value={truck.truckName}>
//               {truck.truckName}
//             </option>
//           ))} */}
//       </select>
//     </div>
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

// type Items = {
//   quantity: number;
//   binId: string;
//   skuCode: string;
// };

// type SKUCOde = string;

// type QuantityWithBin = {
//   binId: string;
//   quantity: number;
// };

// // type ColoredBinsBySKU = Record<SKUCOde, QuantityWithBin[]>;
// type ColoredBinsBySKU = { [skuCode: string]: QuantityWithBin[] };

// type TOrders = {
//   [skuCode: string]: {
//     binId: string;
//     quantity: number;
//   }[];
// };

// // new
// type BinQuantityMap = {
//   [skuCode: string]: { [binId: string]: number };
// };
