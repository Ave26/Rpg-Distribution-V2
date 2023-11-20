import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Toast from "../Parts/Toast";
import { TRecords } from "@/types/recordsTypes";

type TToastData = {
  message: string;
  show: boolean;
};

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
  const data: TRecords[] = await response.json();
  console.log(data);

  for (let dt of data) {
    const orderedProducts = dt.orderedProducts;
    for (let ordered of orderedProducts) {
      console.log(ordered.totalQuantity);
    }
  }

  return data;
};
type TLoadingStates = Record<string, boolean>;

export default function StaffUI() {
  const [loadingStates, setLoadingStates] = useState<TLoadingStates>({});
  const [toastData, setToastData] = useState<TToastData>({
    message: "",
    show: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastData({
        ...toastData,
        show: false,
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [toastData.show]);

  const {
    data: orders,
    isLoading,
    error,
    mutate,
  } = useSWR("/api/outbound/get-order", fetcher, {
    refreshInterval: 1500,
  });

  if (isLoading || error || !orders) {
    return (
      <section className="h-screen w-full">
        <h1>Loading...</h1>
      </section>
    );
  }

  const h1Style = "h-fit w-full border border-black p-2";

  return (
    <section className="h-[20em] w-full overflow-y-scroll border border-black md:h-screen">
      <h1 className="p-5 text-xl font-bold">LIST OF ORDERS</h1>

      <div className="flex h-fit w-full flex-wrap items-start justify-start gap-2 overflow-y-scroll p-2 px-5 font-semibold hover:overflow-y-scroll">
        {orders.length >= 0 ? (
          orders?.map((order) => {
            const isButtonLoading = loadingStates[order.id];

            return (
              <div
                key={order.id}
                className="relative flex h-1/2 w-full flex-wrap  border border-black p-2 transition-all md:w-80">
                <h1 className={h1Style}>
                  {order.truckName} {order.id}
                </h1>
                <h1 className={h1Style}>
                  {order?.author.username || "unknown"}
                </h1>
                <h1 className={h1Style}>{order.clientName}</h1>
                <h1 className={h1Style}>{String(order.dateCreated)}</h1>
                <h1 className={h1Style}>
                  Truck Capacity: {String(order.trucks.capacity)}
                </h1>

                <h1 className={h1Style}>
                  Purchase Order: {order.poId} batch#{order.batchNumber}
                </h1>

                <select className={h1Style}>
                  {order?.orderedProducts?.map((orderedProduct, index) => {
                    return (
                      <option
                        key={index}
                        value={orderedProduct.products.productName}>
                        {`Name: ${orderedProduct.products.productName}, Price: ${orderedProduct.products.price}, Total: ${orderedProduct.totalQuantity}`}
                      </option>
                    );
                  })}
                </select>
                <div className="relative flex w-full flex-row items-center justify-between border border-black px-4">
                  {
                    order?.orderedProducts?.map(
                      (orderedProduct) =>
                        orderedProduct.assignedProducts.map(
                          (assignedProduct) => (
                            <h1 key={assignedProduct.id}>
                              Status: {assignedProduct.status}
                            </h1>
                          )
                        )[0]
                    )[0]
                  }

                  <button
                    disabled={
                      order.orderedProducts.every((orderedProducts) =>
                        orderedProducts.assignedProducts.every(
                          (assignedProduct) =>
                            assignedProduct.status === "Loaded"
                        )
                      )
                        ? true
                        : false
                    }
                    className={`h-fit w-fit rounded-md border ${
                      order.orderedProducts.every((orderedProducts) =>
                        orderedProducts.assignedProducts.every(
                          (assignedProduct) =>
                            assignedProduct.status === "Loaded"
                        )
                      )
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

                      fetch("/api/outbound/update-order", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ orderId: order?.id }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          setToastData({
                            ...toastData,
                            message: data.message,
                            show: true,
                          });
                          mutate();
                        })
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
                      : order.orderedProducts.every((orderedProducts) =>
                          orderedProducts.assignedProducts.every(
                            (assignedProduct) =>
                              assignedProduct.status === "Loaded"
                          )
                        )
                      ? "Loaded on truck"
                      : "load to truck"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-fit w-full flex-wrap items-start justify-start gap-2 overflow-y-scroll p-2 px-5 font-semibold hover:overflow-y-scroll">
            no data
          </div>
        )}
      </div>
      <Toast data={toastData.message} isShow={toastData.show} />
    </section>
  );
}
