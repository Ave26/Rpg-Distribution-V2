import Input from "@/components/Parts/Input";
import { InputStyle } from "@/styles/style";
import { binLocations } from "@prisma/client";
import React, { useEffect } from "react";

type TBinLocationInputs = {
  states: TStates;
};

type TStates = {
  binLocation: TBinLocations;
  setBinLocation: React.Dispatch<React.SetStateAction<TBinLocations>>;
};
type TBinLocations = Omit<binLocations, "id" | "orderedProductsTestId">;

function BinLocationInputs({ states }: TBinLocationInputs) {
  const { binLocation, setBinLocation } = states;

  // useEffect(() => {
  //   console.log(binLocation);
  // }, [binLocation]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setBinLocation({
      ...binLocation,
      [name]: value,
    });
  }

  return (
    <>
      {Object.keys(binLocation).map((key) => {
        return (
          <>
            {key !== "binId" && (
              <Input
                key={key}
                attributes={{
                  input: {
                    id: key,
                    name: key,
                    type: key === "quantity" ? "number" : "text",
                    min: key === "quantity" ? 0 : undefined,
                    value: binLocation[key as keyof TBinLocations],
                    onChange: handleChange,
                  },
                  label: {
                    children: key,
                    htmlFor: key,
                  },
                }}
              />
            )}
          </>
        );
      })}
    </>
  );
}

export default BinLocationInputs;
