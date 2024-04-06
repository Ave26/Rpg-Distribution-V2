import useLocations from "@/hooks/useLocations";
import { InputStyle } from "@/styles/style";
import { locations, records } from "@prisma/client";
import React from "react";

type TSelectLocationInput = {
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

function SelectLocationInput({ states }: TSelectLocationInput) {
  const { handleChange, key } = states;
  const { locations } = useLocations();
  const locationData: locations = {
    coordinates: { latitude: 0, longitude: 0 },
    id: "",
    name: "Select Location",
  };

  const locationWithEmptyString: locations[] = [locationData].concat(
    Array.isArray(locations) ? locations : []
  );

  return (
    <select
      name={key}
      id={key}
      key={key}
      className={InputStyle}
      onChange={handleChange}
    >
      {Array.isArray(locations) ? (
        locationWithEmptyString?.map((location, index) => (
          <option
            key={location.id}
            value={index === 0 ? "" : location.name}
            className="text-xs font-bold uppercase"
          >
            {location.name}
          </option>
        ))
      ) : (
        <option disabled>Loading...</option>
      )}
    </select>
  );
}

export default SelectLocationInput;
