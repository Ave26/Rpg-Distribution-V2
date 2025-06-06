import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";
import SubLayout from "@/Layouts/SubLayout";
import React, { ReactElement, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Head from "next/head";
import useRecords from "@/hooks/useRecords";

/*       <div className="scrollbar-thumb-rounded  scrollbar-track-rounded-full h-32 overflow-y-scroll scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-700">
        <div className="h-64 bg-slate-400">skwak</div>
      </div> */

export default function LogOverview() {
  const [selectedCard, setSelectedCard] = useState<Record<number, string>>({});
  const progressCards = ["ORDER", "PRODUCT STATUS", "DAMAGE PRODUCT"];
  const reportCards = ["REPORTS", "DUPLICATE SCAN", "BIN REPORT"];

  return (
    <section className="flex h-full w-full flex-wrap justify-evenly gap-1 overflow-y-scroll rounded-lg p-2 transition-all scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-700 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
      <div className="flex h-fit w-full flex-wrap justify-evenly gap-2">
        {progressCards.map((v, i) => {
          return (
            <ProgresCard
              key={i}
              cardName={v}
              index={i}
              states={{ selectedCard, setSelectedCard }}
            />
          );
        })}
      </div>

      <div className="flex h-fit w-full flex-wrap justify-evenly gap-2 ">
        {reportCards.map((v, i) => {
          return (
            <ReportCard
              key={i}
              cardName={v}
              index={i}
              states={{ selectedCard, setSelectedCard }}
            />
          );
        })}
      </div>
    </section>
  );
}

LogOverview.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>
        <Head>
          <title>{"Log Overview"}</title>
        </Head>
        <SubLayout>{page}</SubLayout>
      </DashboardLayout>
    </Layout>
  );
};

function ProgresCard({
  cardName,
  index,
  states: { selectedCard, setSelectedCard },
}: {
  cardName: string;
  index: number;
  states: {
    selectedCard: Record<number, string>;
    setSelectedCard: React.Dispatch<
      React.SetStateAction<Record<number, string>>
    >;
  };
}) {
  const { records } = useRecords();

  const map = {
    ORDER: "",
    "PRODUCT STATUS": "",
    "DAMAGE PRODUCT": "",
  };

  return (
    <div className="flex h-1/2 w-full flex-col items-center  justify-center gap-1 rounded-lg transition-all  sm:w-80">
      <h1 className="font-extrabold uppercase">{cardName}</h1>
      <SVGProgresBar />

      <div className="flex h-fit w-full flex-col items-center justify-center">
        <h2 className="font-semibold">Completed/On Queue Orders</h2>
        <h3 className="font-semibold">Expand to see more details below</h3>
      </div>

      <button
        onClick={() => {
          setSelectedCard({
            [index]: selectedCard[index] === cardName ? "" : cardName,
          });
        }}
        className={`flex h-10 w-full items-center justify-end  rounded-lg bg-white px-2`}
      >
        <IoIosArrowBack
          className={selectedCard[index] === cardName ? "-rotate-90" : ""}
        />
      </button>
      {
        <div
          className={`${
            selectedCard[index] === cardName ? "h-36" : "h-0"
          } w-full overflow-hidden rounded-lg bg-white p-2 transition-all`}
        >
          <ul className="flex flex-col items-start justify-start overflow-y-scroll">
            {Array.isArray(records) &&
              records.map((record) => {
                return (
                  <React.Fragment key={record.id}>
                    <li>{record._count.orderedProducts}</li>
                    <li>{record.authorName}</li>
                    <li>{record.id}</li>
                  </React.Fragment>
                );
              })}
          </ul>
        </div>
      }
    </div>
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
    <svg className="h-40 -rotate-90 transform" viewBox="0 0 100 100">
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

function ReportCard({
  cardName,
  index,
  states: { selectedCard, setSelectedCard },
}: {
  cardName: string;
  index: number;
  states: {
    selectedCard: Record<number, string>;
    setSelectedCard: React.Dispatch<
      React.SetStateAction<Record<number, string>>
    >;
  };
}) {
  return (
    <div className="flex h-fit w-full  flex-col items-center justify-center gap-1 rounded-lg sm:w-80">
      <div className="flex h-48 w-full flex-col rounded-lg bg-gradient-to-b from-yellow-400 via-orange-400 to-orange-600 px-1">
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-white">
          <div className="flex h-fit w-full flex-col items-center justify-around">
            <h1 className="font-bold uppercase">{cardName}</h1>
            <h1 className="text-4xl font-bold">54</h1>
            <h2 className="font-semibold">Downloadable copy of reports</h2>
            <h3 className="font-semibold">Expand to see more details below</h3>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          console.log(index);

          setSelectedCard({
            [index]: selectedCard[index] === cardName ? "" : cardName,
          });
        }}
        className={`flex h-10 w-full items-center justify-end rounded-lg bg-white px-2`}
      >
        <IoIosArrowBack
          className={selectedCard[index] === cardName ? "-rotate-90" : ""}
        />
      </button>
      {
        <div
          className={`${
            selectedCard[index] === cardName ? "h-36" : "h-0"
          } w-full rounded-lg bg-white transition-all`}
        ></div>
      }
    </div>
  );
}
