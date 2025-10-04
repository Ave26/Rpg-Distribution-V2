import React from "react";
import useOrders from "../useOrders";

function OrderTable() {
  const { orderData, error, isLoading } = useOrders();

  const orderTitles = [
    "Truck Name",
    "Batch",
    "Client Name",
    "Sales Order",
    "Status",
    "Count",
  ];

  return (
    <div className="flex h-full w-full grid-cols-1 flex-col items-start justify-start overflow-auto rounded-lg bg-white scrollbar-track-rounded-lg md:col-span-2 md:row-span-2 md:w-full md:overflow-x-hidden md:overflow-y-scroll">
      <div className="sticky top-0 flex w-full gap-1 rounded-lg rounded-b-none bg-slate-400 p-1 font-semibold uppercase">
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
      </div>

      {!isLoading &&
        Array.isArray(orderData) &&
        orderData.map((order) => {
          return (
            <ul className="flex h-fit w-full items-center justify-center  gap-1 break-all p-1 uppercase hover:bg-amber-300/70">
              <li className="flex h-full w-full items-center justify-center border">
                {order.trucks?.truckName}
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
            </ul>
          );
        })}
    </div>
  );
}

export default OrderTable;
