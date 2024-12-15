import React, { useEffect, useRef, useState } from "react";
import Loading from "@/components/Parts/Loading";
import useSWR from "swr";
import {
  categories,
  racks,
  bins,
  assignedProducts,
  products,
} from "@prisma/client";
import Toast from "@/components/Parts/Toast";
import InputWLabel from "./InventoryParts/InputWLabel";
import { TBins, TToast } from "./InventoryTypes";
import BinTable from "./InventoryParts/BinTable";
import { MdNavigateNext } from "react-icons/md";
import { useRouter } from "next/router";
import { FaProductHunt } from "react-icons/fa6";
import { buttonStyleSubmit, InputStyle } from "@/styles/style";

type TInput = {
  barcodeId: string;
  sku: string;
  productName: string;
  dateReceiveFrom: Date;
  dateReceiveTo: Date;
  dateExpiryFrom: Date;
  dateExpiryTo: Date;
};

type TResponse = {
  bins: TBins[];
  lastPage: number;
};

type TCategories = categories & {
  racks: TRacks[];
};

type TRacks = racks & {
  bins: TBins[];
};

// type TBins = bins & {
//   assignedProducts: assignedProducts[];
// };

async function fetcher(url: string): Promise<TCategories[]> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      // Handle the error appropriately or rethrow it
      throw error;
    });
}

type DamageProduct = {
  binId: string;
};

type Quantity = number;

export default function InventoryManageMent() {
  const [damageProduct, setDamageProduct] = useState<DamageProductInfo>({
    binId: "",
    quantity: 0,
  });
  const [open, setOpen] = useState(false);
  const [moveDamageBin, setMoveDamageBin] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [startSearching, setStartSearching] = useState(false);
  const [page, setPage] = useState(1);

  const CATEGORY = [
    "Food",
    "Laundry",
    "Cosmetics",
    "Sanitary",
    "Cleaning",
    "Choose Category",
  ];

  const [input, setInput] = useState<TInput>({
    barcodeId: "",
    productName: "",
    sku: "",
    dateExpiryFrom: new Date(),
    dateExpiryTo: new Date(),
    dateReceiveFrom: new Date(),
    dateReceiveTo: new Date(),
  });

  const [toast, setToast] = useState<TToast>({
    message: "",
    show: false,
  });

  const { isLoading, data, mutate } = useSWR(
    `/api/inventory/bins-find?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}`, // ?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}
    fetcher,
    { refreshInterval: 1200 }
  );
  const [bins, setBins] = useState<TBins[] | undefined>([]);

  useEffect(() => {
    let allBins: TBins[] = [];
    if (data) {
      for (let category of data) {
        for (let rack of category.racks) {
          for (let bin of rack.bins) {
            allBins = allBins.concat(bin);
          }
        }
      }
    }

    setBins(allBins);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast((prevState) => {
        return {
          ...prevState,
          show: false,
        };
      });
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.show]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setInput((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  const btnStyle =
    "rounded-sm bg-sky-300/40 p-2 shadow-md hover:bg-sky-300/80 active:bg-sky-300 uppercase text-xs font-bold";

  const inputDateStyle = "w-[15em] ";
  return (
    <div className="relative select-none">
      <div className="flex h-[8%] rounded-t-md bg-white p-2  ">
        <FaProductHunt
          size={30}
          className="flex h-full items-center justify-center drop-shadow-md"
        />
      </div>
      <div
        className={`flex h-[45em] w-full flex-col items-center justify-start gap-2 overflow-y-scroll rounded-b-md bg-slate-300 p-4`}
      >
        <div className="flex flex-row gap-2 p-[2px]">
          <div className="flex flex-col gap-2 p-[2px]">
            <InputWLabel
              inputAttributes={{
                name: "barcodeId",
                id: "barcodeId",
                maxLength: 14,
                value: input.barcodeId,
                onChange: handleChange,
                autoFocus: true,
              }}
              lableAttributes={{
                htmlFor: "barcodeId",
                children: "Barcode Id",
              }}
            />

            <InputWLabel
              inputAttributes={{
                name: "sku",
                id: "sku",
                value: input.sku,
                onChange: handleChange,
              }}
              lableAttributes={{
                htmlFor: "barcodeId",
                children: "Stock Keeping Unit",
              }}
            />

            <InputWLabel
              inputAttributes={{
                name: "productName",
                id: "productName",
                value: input.productName,
                onChange: handleChange,
              }}
              lableAttributes={{
                htmlFor: "productName",
                children: "Product Name",
              }}
            />

            <button
              className={btnStyle}
              onClick={() => {
                setStartSearching((prevStartSearching) => !prevStartSearching);
              }}
            >
              {startSearching ? "x" : "Search"}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex w-full gap-2">
              <InputWLabel
                inputAttributes={{
                  type: "date",
                  name: "dateExpiryFrom",
                  id: "dateExpiryFrom",
                  value: String(input.dateExpiryFrom),
                  onChange: handleChange,
                }}
                lableAttributes={{
                  children: "Date Expiry From:",
                  htmlFor: "dateExpiryFrom",
                }}
                customInputStyle={inputDateStyle}
              />
              <InputWLabel
                inputAttributes={{
                  type: "date",
                  name: "dateExpiryTo",
                  id: "dateExpiryTo",
                  value: String(input.dateExpiryTo),
                  onChange: handleChange,
                }}
                lableAttributes={{
                  children: "Date Expiry To:",
                  htmlFor: "dateExpiryTo",
                }}
                customInputStyle={inputDateStyle}
              />
            </div>

            <div className="flex w-full gap-2">
              <InputWLabel
                inputAttributes={{
                  type: "date",
                  name: "dateReceiveFrom",
                  id: "dateReceiveFrom",
                  value: String(input.dateReceiveFrom),
                  onChange: handleChange,
                }}
                lableAttributes={{
                  children: "Date Receive From:",
                  htmlFor: "dateReceiveFrom",
                }}
                customInputStyle="w-[15em]"
              />
              <InputWLabel
                inputAttributes={{
                  type: "date",
                  name: "dateReceiveTo",
                  id: "dateReceiveTo",
                  value: String(input.dateReceiveTo),
                  onChange: handleChange,
                }}
                lableAttributes={{
                  children: "Date Receive To:",
                  htmlFor: "dateReceiveTo",
                }}
                customInputStyle={inputDateStyle}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className={btnStyle}
              id="printInventory"
              onClick={() => {
                setMoveDamageBin(!moveDamageBin);
              }}
            >
              {moveDamageBin ? "cancel" : "move damaged product"}
            </button>
            <button className={btnStyle} id="printInventory">
              Print Inventory
            </button>
            <button
              className={btnStyle}
              onClick={() => {
                fetch("/api/inventory/products-sort", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ initiate: true }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    setToast((prevState) => {
                      return {
                        ...prevState,
                        message: data.message,
                        show: true,
                      };
                    });

                    return mutate();
                  });
              }}
            >
              Organize Bin
            </button>
          </div>

          <p className="w-18 break-words  text-end text-[10px] uppercase text-red-500">
            Take note: Please ensure that there are no products on Queue
          </p>
        </div>
        <div className="h-[27em] overflow-y-scroll border border-black bg-white">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          ) : (
            <BinTable
              bins={bins}
              states={{
                moveDamageBin,
                open,
                setMoveDamageBin,
                setOpen,
                damageProduct,
                setDamageProduct,
              }}
            />
          )}
        </div>
        <div className="flex w-fit flex-row justify-end gap-2 bg-slate-800/20">
          <button
            onClick={() => {
              setPage((prevPage) => {
                if (prevPage === 1) {
                  mutate();

                  return prevPage;
                } else {
                  mutate();

                  return prevPage - 1;
                }
              });
            }}
          >
            <MdNavigateNext className="rotate-180 text-4xl hover:bg-slate-500/30 active:bg-slate-300/70" />
          </button>
          <h1 className="flex items-center justify-center p-2 text-sm font-extrabold">
            {page}
          </h1>
          <button
            onClick={() => {
              // setPage((prevPage) => {
              //   if (prevPage === data?.lastPage) {
              //     mutate();
              //     return prevPage;
              //   } else {
              //     mutate();
              //     return prevPage + 1;
              //   }
              // });
            }}
          >
            <MdNavigateNext className="rounded-sm text-4xl hover:bg-slate-500/30 active:bg-slate-300/70" />
          </button>
        </div>
      </div>

      {/* <Toast data={toast.message} isShow={toast.show} /> */}
      <div
        className={`  ${
          open ? "animate-emerge" : "hidden animate-fade"
        } absolute inset-0 flex  items-center justify-center rounded-md p-2  backdrop-blur-sm transition-all`}
      >
        <MoveDamageProduct
          setOpen={setOpen}
          states={{ damageProduct, setDamageProduct }}
        />
      </div>
    </div>
  );
}

interface MoveDamageProductProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  states: States;
}

type States = {
  damageProduct: DamageProductInfo;
  setDamageProduct: React.Dispatch<React.SetStateAction<DamageProductInfo>>;
};

/* 
  category, sku, 
  if food expiration date, otherwise 
*/

import { RxCross2 } from "react-icons/rx";
import Input from "../Parts/Input";
import { AiOutlineLoading } from "react-icons/ai";
export type DamageProductInfo = DamageProduct & { quantity: Quantity };

function MoveDamageProduct({ setOpen, states }: MoveDamageProductProps) {
  const { damageProduct, setDamageProduct } = states;
  const [loading, setLoading] = useState(false);

  const { quantity } = damageProduct;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitting");
        fetch("/api/inventory/damage-products/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(damageProduct),
        })
          .then((res) => res.json())
          .catch((e) => console.log(e))
          .finally(() => {
            setLoading(false);
          });
      }}
      className="inset-0 flex h-fit w-[30em] flex-col gap-2 rounded-md bg-white/30 p-2 shadow-md backdrop-blur-sm"
    >
      <RxCross2
        type="button"
        onClick={() => {
          setOpen(false);
        }}
      />
      <h1 className="mb-3 border border-dashed border-black p-2 text-center font-black uppercase">
        send to damage bin
      </h1>
      <div className="flex flex-col gap-2">
        <Input
          attributes={{
            input: {
              id: "quantity",
              name: "quantity",
              type: "number",
              value: quantity,
              onChange: (e) => {
                setDamageProduct({
                  ...damageProduct,
                  quantity: parseInt(e.target.value),
                });
              },
            },
            label: {
              children: "quantity",
              htmlFor: "quantity",
            },
          }}
        />
      </div>
      <button
        type="submit"
        className={`${buttonStyleSubmit} flex items-center justify-center`}
      >
        {loading ? (
          <AiOutlineLoading className="animate-spin" size={30} />
        ) : (
          "submit"
        )}
      </button>
      <>{JSON.stringify(damageProduct)}</>
    </form>
  );
}
