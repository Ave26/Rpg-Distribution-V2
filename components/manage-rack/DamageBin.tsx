import React, { useState } from "react";
import Input from "../Parts/Input";
import {
  buttonStyle,
  buttonStyleEdge,
  buttonStyleSubmit,
  InputStyle,
} from "@/styles/style";
import Loading from "../Parts/Loading";
import useDamageCategories from "@/hooks/useDamageCategories";
import { mutate } from "swr";
import { DamageCategories } from "@/fetcher/fetchDamageCategories";
import { IoRemoveSharp } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";
export interface DamageBin {
  category: string;
  binQuantity: number;
  shelf: number;
}

interface FormProps extends ViewCategoriesProps {
  damageBin: DamageBin;
  setDamageBin: React.Dispatch<React.SetStateAction<DamageBin>>;
}

export default function DamageBin() {
  const { categories } = useDamageCategories();

  const [damageBin, setDamageBin] = useState<DamageBin>({
    binQuantity: 0,
    shelf: 0,
    category: "default",
  });

  return (
    <div className="flex w-full flex-col bg-white">
      {/* <button className={buttonStyleEdge}>Create Damage Category</button> */}
      <div className="h-fit">
        <h1 className="p-2 font-bold uppercase">Create Racks</h1>
        <Form
          damageBin={damageBin}
          setDamageBin={setDamageBin}
          categories={categories}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-2 rounded-md">
        <h1 className="p-2 font-bold uppercase">Create Category</h1>
        <CategoryForm />
        <div className="col-span-2 row-span-6 flex h-[20em] flex-col gap-2 overflow-y-scroll  border-b-0 border-r-0 border-t-0 p-2">
          <ViewCategories categories={categories} />
        </div>
      </div>
      <div className="text-red-600">
        <h1>Note:</h1>
        <p>Inbound: PO</p>
        <p>Invetory: Bin ID</p>
        <p>OutBound: SO</p>
      </div>
      {JSON.stringify(damageBin, null, 2)}
    </div>
  );
}

function Form({ damageBin, setDamageBin, categories }: FormProps) {
  const [loading, setLoading] = useState(false);
  const { category, ...rest } = damageBin;
  return (
    <form
      className="flex gap-2 p-1"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        fetch("/api/inventory/damageBins/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(damageBin),
        }).finally(() => {
          setDamageBin({ binQuantity: 0, category: "default", shelf: 0 });
          setLoading(false);
        });
      }}
    >
      <div className="flex w-full gap-2">
        <select
          name={category}
          value={category}
          onChange={(e) =>
            setDamageBin((prev) => ({ ...prev, category: e.target.value }))
          }
          className={InputStyle}
        >
          <option value={"default"} disabled>
            Select Category
          </option>
          {Array.isArray(categories) &&
            categories.map(({ category }) => {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
        </select>

        <button
          type="button"
          className="flex w-fit items-center justify-center hover:rotate-12 active:scale-90"
          onClick={() => {
            setDamageBin({
              binQuantity: 0,
              category: "default",
              shelf: 0,
            });
          }}
        >
          remove
        </button>
      </div>

      {Object.keys(rest).map((key) => {
        return (
          <Input
            key={key}
            attributes={{
              input: {
                id: key,
                name: key,
                type: "number",
                min: 0,
                value: damageBin[key as keyof DamageBin],
                onChange: (e) => {
                  const { name, value } = e.target;
                  setDamageBin((prev) => ({
                    ...prev,
                    [name]: parseInt(value) <= 0 ? 0 : parseInt(value),
                  }));
                },
              },
              label: {
                htmlFor: key,
                children: key,
              },
            }}
          />
        );
      })}

      <div className="w-fit">
        <button className={buttonStyleSubmit}>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            "submit"
          )}
        </button>
      </div>
    </form>
  );
}

function CategoryForm() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="col-span-2 flex h-fit w-fit gap-2 p-1"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);

        fetch("/api/inventory/damage-categories/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category.toUpperCase()),
        })
          .catch((e) => console.error(e))
          .finally(() => {
            setCategory("");
            mutate("/api/inventory/damageBins/find");
            setLoading(false);
          });
      }}
    >
      <Input
        attributes={{
          input: {
            id: category,
            type: "text",
            name: category,
            value: category,
            onChange: (e) => setCategory(e.target.value),
          },
          label: { htmlFor: category, children: "Category" },
        }}
      />
      <button type="submit" className={buttonStyleSubmit}>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          "submit"
        )}
      </button>
    </form>
  );
}

interface ViewCategoriesProps {
  categories: DamageCategories[] | undefined;
}

function ViewCategories({ categories }: ViewCategoriesProps) {
  return (
    <>
      {Array.isArray(categories) &&
        categories?.map(({ category, count }) => {
          return (
            <div
              className="flex items-end justify-between gap-2 p-2"
              key={category}
            >
              <div className="flex w-full justify-between">
                <ul className="w-full">{category}</ul>
                <div className="w-40">
                  <h1>Product Quantity {count}</h1>
                </div>
              </div>
              <button
                onClick={() => {
                  fetch("/api/inventory/damage-categories/remove", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(category),
                  }).finally(() => {
                    mutate("/api/inventory/category/find");
                  });
                }}
              >
                <IoRemoveSharp className="transition-all hover:scale-150 active:scale-100" />
              </button>
            </div>
          );
        })}
    </>
  );
}
