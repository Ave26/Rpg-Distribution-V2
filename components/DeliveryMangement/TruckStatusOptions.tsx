import { TruckAvailability } from "@prisma/client";
import React, { ChangeEvent } from "react";
import { TForm, TFormExtend } from "./deliveryManagementTypes";

type TTruckStatusOptionsProps = {
  key: string;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  states: TStates;
};

type TStates = {
  form: TFormExtend;
};

function TruckStatusOptions({
  key,
  states,
  handleChange,
}: TTruckStatusOptionsProps) {
  const { form } = states;
  const truckStatus: string[] = Object.keys(TruckAvailability).map(
    (key) => TruckAvailability[key as TruckAvailability] // convert enums to array
  );
  return (
    <select
      name={key}
      id={key}
      value={form[key as keyof TForm]}
      onChange={handleChange}
      className="border-blue-gray-200  text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full appearance-none rounded-[7px] border bg-transparent px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:border-2 focus:border-sky-400">
      {truckStatus.map((statusOption) => (
        <option key={statusOption}>{statusOption}</option>
      ))}
    </select>
  );
}

export default TruckStatusOptions;
