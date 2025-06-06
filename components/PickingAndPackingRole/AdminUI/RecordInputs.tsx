import Input from "@/components/Parts/Input";
import { InputStyle } from "@/styles/style";
import { records } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import SelectTruckInput from "./SelectTruckInput";
import SelectLocationInput from "./SelectLocationInput";
import { TRecord } from "./AdminRecordForm";

type TRecordInputs = {
  states: TStates;
};

type TStates = {
  record: TRecord;
  isDisabled: boolean;
  setRecord: React.Dispatch<React.SetStateAction<TRecord>>;
  currrentCapacity: number;
  setCurrrentCapacity: React.Dispatch<React.SetStateAction<number>>;
};

export type TOptions = {
  value: string;
  currentCapacity: number;
};

function RecordInputs({ states }: TRecordInputs) {
  const {
    setRecord,
    record,
    isDisabled,
    currrentCapacity,
    setCurrrentCapacity,
  } = states;
  const [options, setOptions] = useState<TOptions[]>([]);

  useEffect(() => {
    console.log("capacity", currrentCapacity);
  }, [currrentCapacity]);

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "truckName") {
      const findTruck =
        Array.isArray(options) && options.find((opt) => opt.value === value);
      if (findTruck) {
        setCurrrentCapacity(findTruck.currentCapacity);
      }
    }

    setRecord({
      ...record,
      [name]: value,
    });
  }

  return (
    <>
      {Object.keys(record).map((key) => {
        const ignoreKey = "truckName";

        return (
          <div key={key}>
            {key !== "locationName" && key !== "truckName" && (
              <Input
                key={key}
                attributes={{
                  input: {
                    disabled: isDisabled,
                    id: key,
                    className: InputStyle,
                    name: key === ignoreKey ? undefined : key,
                    value: record[key as keyof TRecord] ?? "",
                    onChange: handleChange,
                  },
                  label: {
                    children: key,
                    htmlFor: key,
                  },
                }}
              />
            )}

            {key === "truckName" && (
              <SelectTruckInput
                states={{ key, record, options, setOptions }}
                handleChange={handleChange}
              />
            )}

            {key === "locationName" && (
              <SelectLocationInput
                states={{ key, record }}
                handleChange={handleChange}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default RecordInputs;
