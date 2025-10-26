import useOrders from "@/features/picking-and-packing/useOrders";
import { InputStyle } from "@/styles/style";
import React, { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { TBins } from "@/features/picking-and-packing/useBins";

function SortOrder() {
  const { orderData, error, isLoading } = useOrders();
  const [truckId, setTruckId] = useState("default");

  const orderTitles = [
    "Truck Name",
    "Batch",
    "Client Name",
    "Sales Order",
    "Status",
    "Count",
    "Location",
    "Gross Weight",
    "Button",
  ];
  return (
    <div className="flex h-full w-full grid-cols-1 flex-col items-start justify-start overflow-auto rounded-lg bg-white scrollbar-track-rounded-lg md:col-span-2 md:row-span-2 md:w-full md:overflow-x-hidden md:overflow-y-scroll">
      {/* <div className="sticky top-0 flex w-full gap-1 rounded-lg rounded-b-none bg-slate-400 p-1 font-semibold uppercase">
        {orderTitles.map((title) => {
          return (
            <h1
              key={title}
              className="flex w-full items-center justify-center rounded-lg border text-center"
            >
              {title}
            </h1>
          );
        })}
      </div> */}

      {!isLoading &&
        Array.isArray(orderData) &&
        orderData.map((order) => {
          return (
            <ul>
              <li>{order.truckName}</li>
              <li>{order.orderId}</li>
              <li>Sales Order: {order.salesOrder}</li>
              <li>
                {order?.products?.map((product) => {
                  return (
                    <ul>
                      <li>{product.skuCode}</li>
                      <li>{product.count}</li>
                    </ul>
                  );
                })}
              </li>
            </ul>
          );
        })}
      {/* 
      {!isLoading &&
        Array.isArray(orderData) &&
        orderData.map((order) => {
          return (
            <ul
              key={order.id}
              className="flex h-fit w-full items-center justify-center  gap-1 break-all p-1 uppercase hover:bg-amber-300/70"
            >
              <li className="flex h-full w-full items-center justify-center border">
                <AssignTruck states={{ setTruckId, truckId }} />
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {order.batch}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {order.clientName}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {order.sales_order}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {order.status}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {order._count.assignedProducts}
              </li>
              <li className="flex h-full w-full items-center justify-center border">
                {order.locations?.name}
              </li>

              <li className="flex h-full w-full items-center justify-center border">
                <input type="number" className={InputStyle} />
              </li>

              <li className="flex h-full w-full items-center justify-center border bg-red-400 text-white">
                {order.status === "SHIPPED" ? (
                  "asd"
                ) : (
                  <button
                    onClick={() => {
                      console.log("shipped to the truck");
                    }}
                  >
                    SHIP IT
                  </button>
                )}
              </li>
            </ul>
          );
        })} */}
    </div>
  );
}

export default SortOrder;

interface AssignTruckProps {
  states: {
    truckId: string;
    setTruckId: React.Dispatch<React.SetStateAction<string>>;
  };
}

function AssignTruck({ states }: AssignTruckProps) {
  const { setTruckId, truckId } = states;
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
