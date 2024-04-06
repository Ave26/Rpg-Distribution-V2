import useTrucks from "@/hooks/useTrucks";
import { InputStyle } from "@/styles/style";
import { TTrucks } from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { useEffect, useState } from "react";

type TSelectTruckInput = {
  states: TStates;
};

type TStates = {
  key: string;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
};

function SelectTruckInput({ states }: TSelectTruckInput) {
  const { handleChange, key } = states;

  const { trucks } = useTrucks();

  const truckData: TTrucks = {
    driverId: "",
    id: "",
    payloadCapacity: 0,
    plate: "",
    records: [],
    routeClusterId: "",
    status: "Empty",
    threshold: 0,
    truckName: "Select Truck",
  };

  const locationWithEmptyString: TTrucks[] = [truckData].concat(
    Array.isArray(trucks) ? trucks : []
  );

  return (
    <select
      name={key}
      id={key}
      key={key}
      className={InputStyle}
      onChange={handleChange}
    >
      {locationWithEmptyString.map((truck, index) => (
        <option
          key={truck.id}
          className="text-xs font-bold uppercase"
          value={index === 0 ? "" : truck.truckName}
        >
          {truck.truckName}
        </option>
      ))}
    </select>
  );
}

export default SelectTruckInput;
