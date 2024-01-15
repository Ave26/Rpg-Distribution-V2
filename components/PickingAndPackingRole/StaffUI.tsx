import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Toast from "../Parts/Toast";
import {
  trucks,
  records,
  assignedProducts,
  orderedProducts,
} from "@prisma/client";
import Circle from "./PickingAndPackingParts/Circle";

type TTrucks = trucks & {
  records: TRecords[];
};

type TRecords = records & {
  orderedProducts: TOrderedProducts[];
};

type TOrderedProducts = orderedProducts & {
  assignedProducts: assignedProducts[];
};

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
  const data: TTrucks[] = await response.json();

  return data;
};

type TAnimate = {
  id: string;
  show: boolean;
  style: "max-h-20" | "max-h-0";
};

export default function StaffUI() {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string>("");
  console.log(selectedRecord);
  const [isBtnOpen, setIsBtnOpen] = useState(false);
  const [animate, setAnimate] = useState<TAnimate>({
    id: "",
    show: false,
    style: "max-h-0",
  });
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
    data: trucks,
    isLoading,
    error,
    mutate,
  } = useSWR("/api/trucks/find-trucks", fetcher, {
    refreshInterval: 1500,
  });

  if (isLoading || error || !trucks) {
    return (
      <section className="flex h-screen w-full items-center justify-center">
        <h1>Loading...</h1>
      </section>
    );
  }

  const buttonStyle =
    "rounded-sm bg-sky-300/40 p-2 shadow-md hover:bg-sky-300/10 active:bg-sky-300 uppercase text-xs font-bold";

  return (
    <section className="flex h-[20em] w-full flex-col overflow-y-scroll whitespace-nowrap p-2 text-sm font-medium uppercase md:h-screen">
      <h1 className="text-xl font-bold">LIST OF ORDERS</h1>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col">
          {trucks?.map((truck) => {
            return (
              <div key={truck.id} className="flex flex-col">
                <div
                  className="flex w-[54em] select-none flex-row items-center justify-between gap-4 rounded-md border border-black p-3"
                  onClick={() => {
                    if (selected.includes(truck.id)) {
                      setSelected(selected.filter((i) => i !== truck.id));
                    } else {
                      setSelected([...selected, truck.id]);
                    }
                  }}>
                  <div className="flex flex-row items-center justify-between gap-2">
                    <h1>
                      <strong className="text-sm">Truck Name:</strong>{" "}
                      {truck.truckName}
                    </h1>
                    <h1>Capacity: {truck.payloadCapacity}</h1>
                  </div>
                  <h1>{truck.records.length}</h1>
                </div>
                <div
                  className={`mb-2 flex w-[54em] ${
                    selected.find((i) => i === truck.id)
                      ? "h-[10em] overflow-y-scroll py-2"
                      : "max-h-0 overflow-hidden"
                  } flex-col items-center justify-start gap-[2px] rounded-sm border border-transparent transition-all`}>
                  {truck?.records?.map((record) => {
                    return (
                      <div
                        key={record.id}
                        className="flex w-full flex-row items-center justify-between rounded-md border border-slate-500/30 p-2">
                        <div className="flex w-[38em] flex-row items-start justify-between gap-2 p-2">
                          <h1>
                            <strong>Batch Number : </strong>{" "}
                            {record.batchNumber}
                          </h1>
                          <h1 className="flex flex-col">
                            <strong>Purchase Order : </strong> {record.poId}
                          </h1>
                          <div>
                            <strong>Product Status:</strong>
                            {record.orderedProducts.map(
                              (orderedProducts) =>
                                orderedProducts.assignedProducts.map(
                                  (assignedProduct) => (
                                    <h1
                                      className="text-xs"
                                      key={assignedProduct.id}>
                                      {assignedProduct.status} -{" "}
                                      {assignedProduct.skuCode}
                                    </h1>
                                  )
                                )[0]
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className={buttonStyle}
                            onClick={() => {
                              console.log(record.id);
                            }}>
                            View Details
                          </button>
                          {isBtnOpen && selectedRecord === record.id && (
                            <div className="flex gap-[2px]">
                              <button
                                className={buttonStyle}
                                onClick={() => setIsBtnOpen(false)}>
                                Cancel
                              </button>
                              <button
                                className={buttonStyle}
                                onClick={() => {
                                  fetch("/api/outbound/update-order", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      orderId: record?.id,
                                    }),
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
                                    .catch((e) => console.log(e));
                                }}>
                                Confirm
                              </button>
                            </div>
                          )}

                          {(isBtnOpen && selectedRecord === record.id) || (
                            <button
                              className={buttonStyle}
                              onClick={() => {
                                setSelectedRecord(record.id);
                                setIsBtnOpen(true);
                              }}>
                              load to truck
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div>skwak</div>
      </div>

      <Toast data={toastData.message} isShow={toastData.show} />
    </section>
  );
}

/* 


*/
