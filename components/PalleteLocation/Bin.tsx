import React, { useState } from "react";
import CreateRack from "../CreateRack";
import Input from "../Parts/Input";
import { buttonStyleSubmit, InputStyle } from "@/styles/style";
import useCategories from "@/hooks/useCategories";
import { Categories } from "@/fetcher/fetchCategories";
import { mutate } from "swr";
import { IoRemoveSharp } from "react-icons/io5";
import Loading from "../Parts/Loading";
import { AiOutlineLoading } from "react-icons/ai";

// <CreateRack /> *

export interface Bin {
  binQuantity: 0;
  shelf: 0;
  category: string | "default";
  rackName: string;
}

interface FormProps extends ViewCategoriesProps {
  bin: Bin;
  setBin: React.Dispatch<React.SetStateAction<Bin>>;
}

interface ViewCategoriesProps {
  categories: Categories[] | undefined;
}

export default function Bin() {
  // const { categories } = useDamageCategories();
  const { categories } = useCategories();

  const [bin, setBin] = useState<Bin>({
    binQuantity: 0,
    shelf: 0,
    category: "default",
    rackName: "",
  });

  return (
    <div className="grid grid-cols-2">
      {/* <button className={buttonStyleEdge}>Create Damage Category</button> */}
      <div className="w-1/2">
        <Form bin={bin} setBin={setBin} categories={categories} />
      </div>
      <div className="grid grid-flow-row grid-cols-2 rounded-md border border-black p-2">
        <CategoryForm />

        <div className="col-span-2 row-span-6 flex h-[20em] flex-col gap-2 overflow-y-scroll border border-b-0 border-r-0 border-t-0 border-black p-2">
          <ViewCategories categories={categories} />
        </div>
      </div>

      {JSON.stringify(bin, null, 2)}
    </div>
  );
}

function CategoryForm() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="col-span-2 flex gap-2 p-2"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);

        fetch("/api/inventory/categories/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category.toUpperCase()),
        })
          .catch((e) => console.error(e))
          .finally(() => {
            mutate("/api/inventory/categories/find");
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
            <AiOutlineLoading className="animate-spin" size={30} />
          </div>
        ) : (
          "submit"
        )}
      </button>
    </form>
  );
}

function ViewCategories({ categories }: ViewCategoriesProps) {
  const [selectCategoryId, setSelectCategoryId] = useState("");

  return (
    <>
      {Array.isArray(categories) &&
        categories?.map(({ category, count, rackNames, id }) => {
          return (
            <div
              className="flex flex-col items-end justify-between gap-2 p-2 hover:bg-slate-200"
              key={category}
              onClick={() => {
                setSelectCategoryId(id);

                if (selectCategoryId === id) {
                  setSelectCategoryId("");
                }
              }}
            >
              <div className="flex w-full justify-between gap-2">
                <div className="flex w-full justify-between">
                  <li>{category}</li>
                  <h1>{count}</h1>
                </div>

                <button
                  onClick={() => {
                    fetch("/api/inventory/categories/remove", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(category),
                    }).finally(() => {
                      mutate("/api/inventory/categories/find");
                    });
                  }}
                >
                  <IoRemoveSharp className="transition-all hover:scale-150 active:scale-100" />
                </button>
              </div>

              {selectCategoryId === id && (
                <div className="flex w-full animate-emerge gap-2 transition-all">
                  <h1 className="flex-none">Rack Names:</h1>
                  <div className="flex w-full gap-2">
                    {rackNames.map((v) => (
                      <h1>[{v}]</h1>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}

function Form({ bin, categories, setBin }: FormProps) {
  const [loading, setLoading] = useState(false);
  const { category, rackName, ...rest } = bin;
  return (
    <form
      className="flex flex-col gap-2 p-2"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        fetch("/api/inventory/bins/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bin),
        }).finally(() => {
          mutate("/api/inventory/bins/find");
          setBin({
            binQuantity: 0,
            category: "default",
            shelf: 0,
            rackName: "",
          });
          setLoading(false);
        });
      }}
    >
      <div className="flex gap-2">
        <select
          name={category}
          value={category}
          onChange={(e) =>
            setBin((prev) => ({ ...prev, category: e.target.value }))
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
            setBin({
              binQuantity: 0,
              category: "default",
              shelf: 0,
              rackName: "",
            });
          }}
        >
          remove
        </button>
      </div>

      <Input
        attributes={{
          input: {
            id: rackName,
            name: rackName,
            type: "text",
            value: rackName,
            onChange: (e) => {
              setBin((prev) => ({
                ...prev,
                rackName: e.target.value.toUpperCase(),
              }));
            },
          },
          label: {
            htmlFor: rackName,
            children: "rackname",
          },
        }}
      />

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
                value: bin[key as keyof Bin],
                onChange: (e) => {
                  const { name, value } = e.target;
                  setBin((prev) => ({
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

      <button className={buttonStyleSubmit}>
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
