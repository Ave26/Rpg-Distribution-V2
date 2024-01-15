import React, { useEffect, useState } from "react";
import { TForm, TFormExtend } from "./deliveryManagementTypes";
import TMInput from "./TMInput";
import { IoIosClose } from "react-icons/io";
import { TruckAvailability } from "@prisma/client";
import TruckStatusOptions from "./TruckStatusOptions";

type TFormUpdateTruckProps = {
  states: TStates;
};

type TStates = {
  truckComponentKey: "create" | "update";
  setTruckComponentKey: React.Dispatch<
    React.SetStateAction<"create" | "update">
  >;
  selectedId: string;
};

export default function FormUpdateTruck({ states }: TFormUpdateTruckProps) {
  const { setTruckComponentKey, selectedId } = states;
  const truckStatus: string[] = Object.keys(TruckAvailability).map(
    (key) => TruckAvailability[key as TruckAvailability] // convert enums to array
  );
  const [form, setForm] = useState<TFormExtend>({
    id: "",
    truckName: "",
    plate: "",
    payloadCapacity: 0,
    status: "",
  });

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

  useEffect(() => {
    console.log(form.status);
  }, [form.status]);

  const btnStyle =
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";

  return (
    <form className="relative flex w-fit animate-emerge flex-col gap-2">
      <div className="flex h-fit w-full justify-end ">
        <button
          className="scale-125 transition-all active:scale-150"
          onClick={() => setTruckComponentKey("create")}>
          <IoIosClose />
        </button>
      </div>
      {Object.keys(form).map((key) => (
        <div key={key}>
          {key === "id" && (
            <div className="flex flex-row gap-2 p-2">
              <p>ID:</p> <p className="font-light">{selectedId}</p>
            </div>
          )}

          {key === "status" && (
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

            // <TruckStatusOptions
            //   key={key}
            //   states={{ form }}
            //   handleChange={handleChange}
            // />
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
      <button className={btnStyle} type="submit">
        Submit
      </button>
    </form>
  );
}
