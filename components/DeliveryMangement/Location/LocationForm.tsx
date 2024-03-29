import React, { useState } from "react";

import { buttonStyleSubmit } from "@/styles/style";
import Input from "@/components/Parts/Input";
import { mutate } from "swr";
import { Coordinates, locations } from "@prisma/client";
import LocationButtonSubmit from "./LocationButtonSubmit";

type TOmitLocation = Omit<locations, "id" | "recordId" | "coordinates">;
type TLocation = TOmitLocation & Coordinates;

export default function LocationForm() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<TLocation>({
    latitude: 0,
    longitude: 0,
    name: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name !== "name" && value.length > 8) {
      setLocation({
        ...location,
        [name]: value.slice(9),
      });
    } else {
      setLocation({
        ...location,
        [name]: name === "name" ? value : parseFloat(value),
      });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    fetch("/api/location/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    })
      .then((res) => res.json())
      .then((data) => data && mutate("/api/location/find"))
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
        setLocation({ ...location, latitude: 0, longitude: 0, name: "" });
      });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-fit animate-emerge flex-col gap-2"
    >
      <h1 className="w-full text-center uppercase">Add Location</h1>
      {Object.keys(location).map((key) => {
        return (
          <Input
            key={key}
            attributes={{
              input: {
                name: key,
                id: key,
                type: key === "name" ? "text" : "number",
                step: key === "name" ? undefined : "any", // Allow any step value, including decimal numbers, for numeric fields
                value: location[key as keyof TLocation],
                // maxLength: key === "name" ? undefined : 8,
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
      <div className="relative flex w-full gap-2">
        <LocationButtonSubmit states={{ loading }} />
        <button className={buttonStyleSubmit} type="button">
          Update
        </button>
      </div>
    </form>
  );
}
