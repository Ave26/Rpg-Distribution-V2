import React, { useEffect, useMemo, useState } from "react";
import { TBinPage } from "../../types";
import { buttonStyleDark, InputStyle } from "@/styles/style";
import { Prisma } from "@prisma/client";
import useSWR from "swr";
import { CiSquareRemove } from "react-icons/ci";
import bin from "@/pages/api/manage-inventory/bin";

interface BinPageProps {
  states: {
    binPage: TBinPage;
    setBinPage: React.Dispatch<React.SetStateAction<TBinPage>>;
  };
}

type PageResult = Prisma.categoriesGetPayload<{
  select: { id: true; category: true; bins: { select: { rackName: true } } };
}>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function BinPage({ states }: BinPageProps) {
  const { binPage, setBinPage } = states;
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    data: categories,
    error,
    isLoading,
  } = useSWR<PageResult[]>(
    shouldFetch ? `/api/manage-inventory/bin/pages` : null,
    fetcher
  );

  const rackNames = useMemo(() => {
    const selectedCategory =
      Array.isArray(categories) &&
      categories.find((cat) => cat.category === states.binPage.category)?.bins;

    return Array.isArray(selectedCategory)
      ? selectedCategory.map((b) => b.rackName)
      : [];
  }, [binPage.category, categories]);

  // useEffect(() => {
  //   console.log(rackNames);
  // }, [rackNames]);

  return (
    <div className="flex h-full w-full gap-2 text-fluid-xxxxs">
      <select
        name="category"
        id="category"
        className="font-bolder appearance-none rounded-lg border-none bg-slate-700 p-1 text-fluid-xs text-white"
        value={binPage.category}
        onFocus={() => !shouldFetch && setShouldFetch(true)}
        onChange={(e) => {
          setBinPage((prev) => {
            return { ...prev, category: e.target.value, rackName: "default" };
          });
        }}
      >
        <option
          value="default"
          hidden
          disabled
          className="w-full appearance-none text-center"
        >
          {isLoading ? "Loading..." : "Select a category"}
        </option>
        {Array.isArray(categories) &&
          categories.map((page, i) => (
            <option
              key={i}
              value={page.category}
              className="w-full appearance-none text-center"
            >
              {page.category}
            </option>
          ))}
      </select>
      <select
        name="rackName"
        id="rackName"
        className="font-bolder appearance-none rounded-lg border-none bg-slate-700 p-1 text-fluid-xs text-white"
        value={binPage.rackName}
        onFocus={(e) => {
          console.log("rackName");
        }}
        onChange={(e) => {
          setBinPage((prev) => {
            return { ...prev, rackName: e.target.value };
          });
        }}
      >
        <option
          value="default"
          hidden
          disabled
          className="w-full appearance-none text-center"
        >
          Select a RackName
        </option>

        {rackNames.map((rack) => {
          return (
            <option
              key={rack}
              value={rack}
              className="w-full appearance-none text-center"
            >
              {rack}
            </option>
          );
        })}
      </select>
      <button
        className="flex h-10 w-full items-center justify-center transition-all hover:scale-150 active:scale-125"
        onClick={() => {
          setBinPage({ category: "default", rackName: "default" });
        }}
      >
        <CiSquareRemove size={25} />
      </button>
    </div>
  );
}

export default BinPage;
