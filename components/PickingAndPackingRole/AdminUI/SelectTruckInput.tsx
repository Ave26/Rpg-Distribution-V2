import useTrucks from "@/hooks/useTrucks";
import { InputStyle } from "@/styles/style";
import { TTrucks } from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { useEffect, useRef, useState } from "react";
import { TRecord } from "./AdminRecordForm";

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
};

type TOptions = {
  value: string;
};

function SelectTruckInput({ handleChange, states }: TSelectTruckInput) {
  const { key, record } = states;
  const [options, setOptions] = useState<TOptions[]>([]);
  const { trucks } = useTrucks();

  function handleOption() {
    const newArray: TOptions[] =
      (Array.isArray(trucks) &&
        trucks?.map((truck) => ({
          value: truck.truckName,
          label: truck.truckName,
          disabled: false,
          selected: false,
        }))) ||
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
            {opt.value}
          </option>
        );
      })}
    </select>
  );
}

export default SelectTruckInput;
