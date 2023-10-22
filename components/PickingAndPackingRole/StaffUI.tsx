import React, { useState } from "react";
import useSWR from "swr";
import { orders, trucks as TTrucks } from "@prisma/client";

type TOrders = orders & {
  trucks: TTrucks;
  users: {
    username: string;
  };
};

type TLoadingStates = Record<string, boolean>;

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: TOrders[] = await response.json();
  return data;
};

export default function StaffUI() {
  const [loadingStates, setLoadingStates] = useState<TLoadingStates>({});
  const { data: orders, isLoading } = useSWR(
    "/api/outbound/find-report",
    fetcher,
    {
      refreshInterval: 1500,
    }
  );

  if (isLoading) {
    return (
      <section className="h-screen w-full">
        <h1>Loading...</h1>
      </section>
    );
  }

  const h1Style = "h-fit w-full border border-black p-2";

  return (
    <>
      <h1 className="p-5 text-xl font-bold">LIST OF ORDERS</h1>

      <section className="flex h-screen w-full flex-wrap gap-2 overflow-y-scroll px-5 font-semibold">
        {orders?.map((order) => {
          const isButtonLoading = loadingStates[order.id];

          return (
            <div
              key={order.id}
              className="relative flex h-1/2 w-full flex-wrap  border border-black p-2 transition-all md:w-80">
              <h1 className={h1Style}>
                {order.truckName} {order.id}
              </h1>
              <h1 className={h1Style}>{order?.users?.username || "unknown"}</h1>
              <h1 className={h1Style}>{order.clientName}</h1>
              <h1 className={h1Style}>{String(order.dateCreated)}</h1>
              <select className={h1Style}>
                {order?.productOrdered?.map((product, index) => {
                  return (
                    <option key={index} value={product.productName}>
                      {`Name: ${product.productName}, Price: ${product.price}, Total: ${product.totalQuantity}`}
                    </option>
                  );
                })}
              </select>
              <div className="relative flex w-full flex-row items-center justify-between border border-black px-4">
                <h1 className="">Status: {order.trucks.status}</h1>
                <button
                  disabled={order.trucks.status === "Loaded" ? true : false}
                  className={`h-fit w-fit rounded-md border ${
                    order.trucks.status === "Loaded"
                      ? "border-black/30"
                      : "border-black hover:border-transparent hover:bg-slate-900 hover:text-white "
                  }  p-2 text-xs font-bold transition-all `}
                  key={order.clientName}
                  id={order.id}
                  onClick={() => {
                    setLoadingStates({
                      ...loadingStates,
                      [order.id]: true,
                    });
                    fetch("/api/outbound/update-report", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ orderId: order?.id }),
                    })
                      .then((response) => response.json())
                      .then((data) => console.log(data))
                      .catch((e) => console.log(e))
                      .finally(() => {
                        setLoadingStates({
                          ...loadingStates,
                          [order.id]: false,
                        });
                      });
                  }}>
                  {isButtonLoading
                    ? "loading..."
                    : order.trucks.status === "Loaded"
                    ? "Loaded on truck"
                    : "load to truck"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
