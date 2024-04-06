import Input from "@/components/Parts/Input";
import { InputStyle } from "@/styles/style";
import { records } from "@prisma/client";
import React from "react";
import SelectTruckInput from "./SelectTruckInput";
import SelectLocationInput from "./SelectLocationInput";

type TRecordInputs = {
  states: TStates;
};

type TStates = {
  record: TRecord;
  setRecord: React.Dispatch<React.SetStateAction<TRecord>>;
};

type TRecord = Omit<
  records,
  "id" | "dateCreated" | "batchNumber" | "authorName"
>;

function RecordInputs({ states }: TRecordInputs) {
  const { setRecord, record } = states;

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setRecord({
      ...record,
      [name]: value,
    });
  }

  return (
    <>
      {Object.keys(record).map((key) => {
        const ignoreKey = "locationName" || "truckName";

        return (
          <div key={key}>
            {key !== "locationName" && key !== "truckName" && (
              <Input
                key={key}
                attributes={{
                  input: {
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
              <SelectTruckInput states={{ handleChange, key }} />
            )}

            {key === "locationName" && (
              <SelectLocationInput states={{ handleChange, key }} />
            )}
          </div>
        );
      })}
    </>
  );
}

export default RecordInputs;
