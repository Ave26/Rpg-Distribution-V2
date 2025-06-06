import {
  formatDate,
  getLastProductStatus,
  getTotalProductQuantity,
  totalPWeight,
} from "@/utils";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

interface OrderQueueProps {
  slug: string;
}

export type RecordWithOrderedProductsAndBins = Prisma.recordsGetPayload<{
  include: {
    _count: { select: { orderedProducts: true } };

    orderedProducts: {
      include: {
        binLocations: {
          include: {
            assignedProducts: true;
            stockKeepingUnit: { select: { weight: true } };
          };
        };
      };
    };
  };
}>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrderQueue({ slug }: OrderQueueProps) {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<RecordWithOrderedProductsAndBins[]>(
    slug ? `/api/logs/${slug}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  console.log(orders);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading logs</p>;

  // const card = tv({
  //   slots: {
  //     base: "md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-gray-900",
  //     avatar:
  //       "w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto drop-shadow-lg",
  //     wrapper: "flex-1 pt-6 md:p-8 text-center md:text-left space-y-4",
  //     description: "text-md font-medium",
  //     infoWrapper: "font-medium",
  //     name: "text-sm text-sky-500 dark:text-sky-400",
  //     role: "text-sm text-slate-700 dark:text-slate-500",
  //   },
  // });

  return (
    <section
      className="overflow-x-none flex h-full w-full flex-col gap-2 break-all rounded-lg bg-white
       p-1 text-fluid-xxs transition-all scrollbar-thin sm:text-fluid-sm md:text-fluid-xs"
    >
      <Link
        href={""}
        className="text-fluid-xs font-semibold text-sky-500 underline hover:text-sky-400"
      >
        Generate Order Report for this Month
      </Link>
      {/* flex h-14 w-full items-center justify-end gap-1 whitespace-nowrap rounded-lg bg-white p-1 text-[.4em] md:gap-4 md:text-sm 
          Barcode:  
          Customer Name:
          Creation Date:
          Total Items:
          Total Quantity:
          Total Weight:
          Status:
      
      flex w-full flex-wrap gap-2 rounded-xl bg-white p-2 text-fluid-xs font-semibold
      */}

      <div className="flex h-full w-full flex-col items-start justify-start overflow-auto rounded-lg scrollbar-track-rounded-lg md:col-span-2 md:row-span-4 md:w-full md:overflow-x-hidden md:overflow-y-scroll">
        <div className="sticky top-0 flex w-full gap-1 rounded-lg rounded-b-none bg-slate-400 p-1 font-semibold uppercase">
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Barcode
          </h1>
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Client Name
          </h1>
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Date
          </h1>
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Total Items
          </h1>
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Total Quantity
          </h1>
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Weight
          </h1>
          <h1 className="flex w-full items-center justify-center rounded-lg border text-center">
            Status
          </h1>
        </div>
        {Array.isArray(orders) &&
          orders.map((order, i) => {
            return (
              <ul
                key={i}
                className="flex h-fit w-full items-center justify-center  gap-1 break-all p-1 uppercase hover:bg-amber-300/70"
              >
                <li className="flex h-full w-full items-center justify-center border">
                  {order.SO}
                  {order.batchNumber}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {order.clientName}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {formatDate(order.dateCreated)}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {order._count.orderedProducts}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {getTotalProductQuantity(order)}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {totalPWeight(order) * getTotalProductQuantity(order)}
                </li>
                <li className="flex h-full w-full items-center justify-center border">
                  {getLastProductStatus(order)}

                  {/* very confusing, I am getting only the status of 1st item */}
                </li>
              </ul>
            );
          })}
      </div>
    </section>
  );
}

function SVGProgresBar() {
  const [damagedProducts, setDamagedProducts] = useState(0);
  const [goodProducts, setGoodProducts] = useState(200);
  const [damagePercent, setDamagePercent] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDamagedProducts((prev) => prev + 50);
    }, 500); // Delay for demonstration
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (goodProducts > 0) {
      const percent = (damagedProducts / goodProducts) * 100;
      setDamagePercent(percent);
    }
  }, [damagedProducts, goodProducts]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (damagePercent / 100) * circumference;

  return (
    <svg className="-rotate-90 transform" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="damageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(250, 204, 21)" stopOpacity="1" />
          <stop offset="50%" stopColor="rgb(251, 146, 60)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgb(234, 88, 12)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <circle
        className="text-gray-300"
        strokeWidth="10"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />

      <circle
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        stroke="url(#damageGradient)"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
        style={{
          transition: "stroke-dashoffset 1s ease-out",
        }}
      />

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20"
        fontWeight="bold"
        fill="black"
        transform="rotate(90 50 50)"
      >
        {damagedProducts}
      </text>
    </svg>
  );
}
