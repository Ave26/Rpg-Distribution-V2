import React, { useEffect, useState } from "react";
import { TForm } from "./deliveryManagementTypes";
import { mutate } from "swr";
import { TToast } from "../Inventory/InventoryTypes";
import TMInput from "./TMInput";
import Loading from "../Parts/Loading";

type TFormCreateTruckProps = {
  states: TStates;
};

type TStates = {
  toast: TToast;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
};

function FormCreateTruck({ states }: TFormCreateTruckProps) {
  const [loading, setLoading] = useState(false);
  const { setToast, toast } = states;
  const [form, setForm] = useState<TForm>({
    truckName: "",
    plate: "",
    payloadCapacity: 0,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "payloadCapacity" ? parseInt(value) : value,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    console.log("submitting");
    fetch("/api/trucks/add-truck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form }),
    })
      .then((res) => res.json())
      .then((data) => {
        mutate("/api/trucks/find-trucks");
        setToast({ ...toast, show: true, message: data.message });
      })
      .catch((e) => e)
      .finally(() => {
        setForm({
          ...form,
          plate: "",
          payloadCapacity: 0,
          truckName: "",
        });
        setLoading(false);
      });
  }

  const btnStyle =
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 h-10 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
  return (
    <form
      className="relative flex w-fit animate-emerge flex-col gap-2"
      onSubmit={handleSubmit}
    >
      {Object.keys(form).map((key) => (
        <TMInput
          key={key}
          attributes={{
            input: {
              name: key,
              id: key,
              type:
                typeof form[key as keyof TForm] === "number"
                  ? "number"
                  : "text",
              min: typeof form[key as keyof TForm] === "number" ? 0 : undefined,
              value: form[key as keyof TForm],
              onChange: handleChange,
            },
            label: {
              children: key,
              htmlFor: key,
            },
          }}
        />
      ))}

      <button className={btnStyle} type="submit">
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

export default FormCreateTruck;
