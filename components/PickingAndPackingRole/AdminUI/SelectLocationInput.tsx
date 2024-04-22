import useLocations from "@/hooks/useLocations";
import { InputStyle } from "@/styles/style";
import { locations, records } from "@prisma/client";
import React, { useState } from "react";
import { TRecord } from "./AdminRecordForm";

type TSelectLocationInput = {
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  states: TStates;
};

type TStates = {
  key: string;
  record: TRecord;
};

type TOptions = {
  value: string;
};

function SelectLocationInput({ states, handleChange }: TSelectLocationInput) {
  const { key, record } = states;
  const { locations } = useLocations();
  const [options, setOptions] = useState<TOptions[]>([]);

  function handleOption() {
    const newArray: TOptions[] =
      (Array.isArray(locations) &&
        locations?.map((location) => ({ value: location.name }))) ||
      [];
    setOptions([...newArray]);
  }

  return (
    <select
      key={key}
      name={key}
      value={record.locationName}
      onChange={handleChange}
      onClick={handleOption}
      className={InputStyle}
    >
      <option value={"default"} disabled>
        Select Location
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

export default SelectLocationInput;
