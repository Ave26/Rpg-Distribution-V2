import React, { useState } from "react";
import { Category, damageBin, DamageCategory } from "@prisma/client";
import Input from "../Parts/Input";
import { TChangeEventType } from "@/pages/dashboard/barcode-scanner";
import { buttonStyle, buttonStyleSubmit, InputStyle } from "@/styles/style";
import Loading from "../Parts/Loading";

type TypeAndStyleReturnType = {
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  style?: string;
};

// type category = DamageCategory;
export interface DamageBin {
  category: DamageCategory;
  binQuantity: number;
  capacity: number;
}

function DamageBin() {
  const [loading, setLoading] = useState(false);
  const [damageBin, setDamageBin] = useState<DamageBin>({
    category: "Default",
    binQuantity: 0,
    capacity: 0,
  });

  function parseIntValue(key: keyof DamageBin, value: string): number | string {
    switch (key) {
      case "binQuantity":
      case "capacity":
        return parseInt(value);

      default:
        return value;
    }
  }

  function handleChange(e: TChangeEventType) {
    const { name, value } = e.target;
    const typeName = name as keyof DamageBin;
    setDamageBin((prev) => ({
      ...prev,
      [name]: parseIntValue(typeName, value),
    }));
  }

  function selectionByKey(key: keyof DamageBin): Record<string, any> {
    switch (key) {
      case "category":
        return DamageCategory;
      default:
        break;
    }

    return {};
  }

  function renderInput(key: keyof DamageBin) {
    switch (key) {
      case "capacity":
      case "binQuantity":
        return (
          <Input
            attributes={{
              input: {
                id: key,
                name: key,
                type: setInputTypeAndStyle(key).type,
                value: damageBin[key].toLocaleString(),
                onChange: handleChange,
                min: 0,
              },
              label: {
                htmlFor: key,
                children: key,
              },
            }}
          />
        );
      case "category":
        return (
          <select
            key={key}
            name={key}
            value={damageBin[key].toLocaleString()}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value={"Default"} disabled>
              Select Category
            </option>
            {Object.keys(selectionByKey(key)).map((opt) => {
              return (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              );
            })}
          </select>
        );

      default:
        return <></>;
    }
  }

  function setInputTypeAndStyle(key: keyof DamageBin): TypeAndStyleReturnType {
    switch (key) {
      case "capacity":
        return { type: "number" };
      case "binQuantity":
        return { type: "number" };
      default:
        return { type: "text" };
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    fetch("/api/damage-bin/create", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(damageBin),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        setDamageBin({
          category: "Default",
          binQuantity: 0,
          capacity: 0,
        });
      });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1  gap-2 bg-sky-300/70 p-3"
    >
      {Object.keys(damageBin).map((key) => {
        const typeKey = key as keyof DamageBin;
        return (
          <div key={key} className={setInputTypeAndStyle(typeKey).style}>
            {renderInput(typeKey)}
          </div>
        );
      })}
      <button
        type="button"
        className={buttonStyle}
        onClick={() =>
          setDamageBin({
            category: "Default",
            binQuantity: 0,
            capacity: 0,
          })
        }
      >
        Reset
      </button>
      <button type="submit" className={buttonStyleSubmit}>
        {loading ? (
          <div className="flex h-fit w-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          "Create Damage Bin"
        )}
      </button>
      <>{JSON.stringify(damageBin)}</>
    </form>
  );
}

export default DamageBin;
