import useTrucks from "@/hooks/useTrucks";
import { InputStyle } from "@/styles/style";
import { TTrucks } from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { useEffect, useRef, useState } from "react";
import { TRecord } from "./AdminRecordForm";
import { TOptions } from "./RecordInputs";

type TSelectTruckInput = {
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  states: TStates;
};

type TStates = {
  record: TRecord;
  key: string;
  options: TOptions[];
  setOptions: React.Dispatch<React.SetStateAction<TOptions[]>>;
};

function SelectTruckInput({ handleChange, states }: TSelectTruckInput) {
  const { key, record, options, setOptions } = states;
  const { trucks } = useTrucks();

  function handleOption() {
    const newArray: TOptions[] =
      (Array.isArray(trucks) &&
        trucks
          ?.filter((opt) => opt.status !== "FullLoad")
          .map((truck) => {
            return {
              value: truck.truckName,
              currentCapacity: truck.payloadCapacity,
            };
          })) ||
      [];
    setOptions([...newArray]);
  }

  return (
    <select
      key={key}
      name={key}
      value={record.truckName}
      onChange={handleChange}
      onClick={handleOption}
      className={InputStyle}
    >
      <option value={"default"} disabled>
        Select Truck
      </option>
      {options.map((opt) => {
        return (
          <option value={opt.value} key={opt.value}>
            {opt.value} Capacity: {opt.currentCapacity}
          </option>
        );
      })}
    </select>
  );
}

export default SelectTruckInput;
