import React, { useEffect, useState } from "react";
import { TBinLocation, TBinLocations, TCreateOrderedProduct } from "./Admin";
import Input from "@/components/Parts/Input";
import { buttonStyleEdge, buttonStyleSubmit } from "@/styles/style";
import { TBins } from "@/fetcher/fetchBins";
import { TToast } from "../Toast";

type TBinSearchForm = {
  states: TStates;
};

type TStates = {
  data: TBins[] | undefined;
  binLocation: TBinLocation;
  setBinLocation: React.Dispatch<React.SetStateAction<TBinLocation>>;
  bins: TBins[] | undefined;
  setBins: React.Dispatch<React.SetStateAction<TBins[] | undefined>>;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  setBinLocations: React.Dispatch<React.SetStateAction<TBinLocations[]>>;
  binLocations: TBinLocations[];
  currrentCapacity: number;
  weight: number;
  setWeight: React.Dispatch<React.SetStateAction<number>>;
};
export default function BinSearchForm({ states }: TBinSearchForm) {
  const {
    bins,
    total,
    data,
    setBins,
    setToast,
    setTotal,
    binLocation,
    setBinLocation,
    currrentCapacity,
    weight,
  } = states;

  useEffect(() => {
    if (currrentCapacity !== 0) {
      const netWeight = binLocation.totalQuantity * weight;
      console.log({
        netWeight,
        totalQuantity: binLocation.totalQuantity,
        w: weight,
      });
      if (currrentCapacity < netWeight) {
        setToast({
          animate: "animate-emerge",
          door: true,
          message: "Truck Capacity Exceeded",
        });
        setBinLocation({
          ...binLocation,
          totalQuantity: 0,
        });
      }
    }
  }, [currrentCapacity, binLocation.totalQuantity]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    const totalQuantity = Array.isArray(bins)
      ? bins.reduce(
          (accumulator, initial: TBins) =>
            accumulator + initial._count.assignedProducts,
          0
        )
      : 0;

    setBinLocation({
      ...binLocation,
      [name]:
        name === "totalQuantity" &&
        (parseInt(value) > totalQuantity || parseInt(value) < 0)
          ? 0
          : name === "totalQuantity"
          ? !value
            ? ""
            : parseInt(value)
          : value,
    });

    // Conditionally trigger the toast if the value exceeds the total quantity or falls below

    if (name === "totalQuantity") {
      if (parseFloat(value) > totalQuantity || parseFloat(value) < 0) {
        setToast({
          animate: "animate-emerge",
          door: true,
          message: "Reach Maximum Quantity",
        });
      }
    }

    setTotal(totalQuantity);
  }

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBinLocation({
      ...binLocation,
      totalQuantity: 0,
    });

    const filteredBins = bins?.filter((bin) => {
      return bin.assignedProducts.some(
        (assignedProduct) => assignedProduct.skuCode === binLocation.searchSKU
      );
    });

    return (
      binLocation.searchSKU &&
      setBins(
        !filteredBins?.length
          ? () => {
              setToast({
                animate: "animate-emerge",
                door: true,
                message: "No Product Found",
              });
              return data;
            }
          : () => {
              return filteredBins;
            }
      )
    );
  }

  useEffect(() => {
    !binLocation.searchSKU &&
      setBinLocation({ ...binLocation, totalQuantity: 0 });
  }, [binLocation.searchSKU]);

  return (
    <form
      onSubmit={handleFilter}
      className="flex flex-col justify-center gap-2  transition-all md:flex-row"
    >
      <div className="flex flex-col gap-2">
        {Object.keys(binLocation).map((key) => {
          return (
            <Input
              key={key}
              attributes={{
                input: {
                  name: key,
                  id: key,
                  type: key === "totalQuantity" ? "number" : "text",
                  min: key === "totalQuantity" ? 0 : undefined,
                  max: key === "totalQuantity" ? total : undefined,
                  value: binLocation[key as keyof TBinLocation],
                  onChange: handleChange,
                },
                label: {
                  children: key,
                  htmlFor: key,
                },
              }}
            />
          );
        })}
      </div>
      <div className="flex h-full w-full items-center justify-center">
        <button className={`${buttonStyleEdge} w-full md:active:bg-slate-400`}>
          Search
        </button>
      </div>
    </form>
  );
}
