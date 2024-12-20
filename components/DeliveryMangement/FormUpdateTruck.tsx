import React, { useEffect, useMemo, useState } from "react";
import { TForm, TFormExtend, TSelectedTruck } from "./deliveryManagementTypes";
import TMInput from "./TMInput";
import { IoIosClose } from "react-icons/io";
import { TruckAvailability, trucks } from "@prisma/client";
import TruckStatusOptions from "./TruckStatusOptions";
import { TToast } from "../Inventory/InventoryTypes";
import Loading from "../Parts/Loading";
import { mutate } from "swr";
import { buttonStyleEdge, buttonStyleSubmit } from "@/styles/style";

type TData = {
  updatedTruck: trucks;
  message: string;
};

type TFormUpdateTruckProps = {
  states: TStates;
};

type TStates = {
  truckComponentKey: "create" | "update";
  setTruckComponentKey: React.Dispatch<
    React.SetStateAction<"create" | "update">
  >;
  selectedTruck: TSelectedTruck;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
};

export default function FormUpdateTruck({ states }: TFormUpdateTruckProps) {
  const [loading, setLoading] = useState(false);
  const { setTruckComponentKey, selectedTruck, setToast } = states;
  const initialForm = useMemo(
    () => ({
      truckName: selectedTruck.truckName,
      plate: "",
      payloadCapacity: 0,
      status: selectedTruck.truckStatus,
    }),
    [selectedTruck.truckName, selectedTruck.truckStatus] // Dependencies
  );

  const [form, setForm] = useState<TFormExtend>(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  // useEffect(() => {
  //   setForm({ ...form, status: selectedTruck.truckStatus });
  // }, [selectedTruck.truckStatus]); change it to useMemo

  const truckStatus: string[] = Object.keys(TruckAvailability).map(
    (key) => TruckAvailability[key as TruckAvailability] // convert enums to array
  );

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "payloadCapacity" ? parseInt(value) : value,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    fetch("/api/trucks/update-trucks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, id: selectedTruck.id }),
    })
      .then((res) => res.json())
      .then((data: TData) => {
        mutate("/api/trucks/find-trucks");
        setToast((prevState) => ({
          ...prevState,
          message: data.message,
          show: true,
        }));
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setTruckComponentKey("create");
        setLoading(false);
      });
  }

  return (
    <form
      className="relative flex w-fit animate-emerge flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <div className="flex h-fit w-full justify-end ">
        <button
          type="button"
          onClick={() => setTruckComponentKey("create")}
          className="scale-125 transition-all active:scale-150"
        >
          <IoIosClose />
        </button>
      </div>

      {Object.keys(form).map((key) => (
        <div key={key}>
          {key === "status" && (
            <div className="flex flex-col gap-2 p-2">
              <label htmlFor={key} className="">
                Select Status:
              </label>
              <select
                name={key}
                id={key}
                value={form[key as keyof TForm]}
                onChange={handleChange}
                className="border-blue-gray-200  text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full appearance-none rounded-[7px] border bg-transparent px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:border-2 focus:border-sky-400"
              >
                {truckStatus.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
          )}

          {key !== "status" && key !== "id" && (
            <TMInput
              attributes={{
                input: {
                  name: key,
                  id: key,
                  type:
                    typeof form[key as keyof TForm] === "number"
                      ? "number"
                      : "text",
                  min:
                    typeof form[key as keyof TForm] === "number"
                      ? 0
                      : undefined,
                  value: form[key as keyof TForm],
                  onChange: handleChange,
                },
                label: {
                  children: key,
                  htmlFor: key,
                },
              }}
            />
          )}
        </div>
      ))}
      <button className={buttonStyleSubmit} type="submit">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
