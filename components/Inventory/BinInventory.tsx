import React, { useEffect, useRef, useState } from "react";
import Loading from "@/components/Parts/Loading";
import useSWR from "swr";
import {
  Category,
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

type TInput = {
  barcodeId: string;
  sku: string;
  productName: string;
  dateReceiveFrom: Date;
  dateReceiveTo: Date;
  dateExpiryFrom: Date;
  dateExpiryTo: Date;
  category: Category;
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

export default function InventoryManageMent() {
  const router = useRouter();
  // const { page, itemsPerPage } = router.query;

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
    category: "Choose Category" as Category,
  });

  const [toast, setToast] = useState<TToast>({
    message: "",
    show: false,
  });

  const { isLoading, data, mutate } = useSWR(
    `/api/inventory/bins-find?page=${page}&itemsPerPage=${ITEMS_PER_PAGE}`,
    fetcher,
    { refreshInterval: 1200 }
  );
  const [bins, setBins] = useState<TBins[] | undefined>([]);
  const [categories, setCategories] = useState<TCategories[] | undefined>(data);

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

  // useEffect(() => {
  //   console.log("filtering");
  //   if (startSearching) {
  //     const filteredBins = data?.bins.filter((bin) =>
  //       bin.assignedProducts.some(
  //         (assignedProduct) =>
  //           assignedProduct.barcodeId === input.barcodeId ||
  //           assignedProduct.skuCode === input.sku ||
  //           assignedProduct.products.productName === input.productName
  //       )
  //     );
  //     setBins(filteredBins);
  //   } else {
  //     setBins(data?.bins);
  //   }
  // }, [data, startSearching]);

  // useEffect(() => {
  //   const doc = new jsPDF({
  //     orientation: "p",
  //     unit: "pt",
  //     format: "letter",
  //   });

  //   const btn = document.querySelector("#printInventory");
  //   const input = document.querySelector("input");

  //   const columns = [
  //     { title: "COL1", dataKey: "col1" },
  //     { title: "COL2", dataKey: "col2" },
  //     { title: "COL3", dataKey: "col3" },
  //     { title: "COL4", dataKey: "col4" },
  //   ];

  //   const rows = [
  //     {
  //       col1: "data-cell_r1_c1",
  //       col2: "data-cell_r1_c2",
  //       col3: "data-cell3_r1_c3",
  //       col4: "data-cell4_r1_c4",
  //     },
  //     {
  //       col1: "data-cell_r2_c1",
  //       col2: "data-cell_r2_c2",
  //       col3: "data-cell3_r2_c3",
  //       col4: "data-cell4_r2_c4",
  //     },
  //     {
  //       col1: "data-cell_r3_c1",
  //       col2: "data-cell_r3_c2",
  //       col3: "data-cell3_r3_c3",
  //       col4: "data-cell4_r3_c4",
  //     },
  //   ];

  //   // Your other code...

  //   btn?.addEventListener("click", () => {
  //     const name = input?.value;
  //     doc.autoTable(columns);
  //     doc.save(`${name}.pdf`);
  //   });
  // }, []);

  const btnStyle =
    "rounded-sm bg-sky-300/40 p-2 shadow-md hover:bg-sky-300/80 active:bg-sky-300 uppercase text-xs font-bold";

  const inputDateStyle = "w-[15em]";
  return (
    <div className="transition-all">
      <div className="flex flex-row items-center justify-between gap-[2px] p-2">
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
              }}>
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

            <select
              value={input.category}
              onChange={handleChange}
              name="category"
              className="h-8 appearance-none rounded-sm border border-black px-2 text-xs font-bold outline-none">
              {CATEGORY.map((c, index) => {
                return <option key={index}>{c}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-2">
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
              }}>
              Organize Bin
            </button>
          </div>

          <p className="w-18 break-words  text-end text-[10px] uppercase text-red-500">
            Take note: Please ensure that there are no products on Queue
          </p>
        </div>
      </div>

      <div className="h-[27em] overflow-y-scroll border border-black">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          <BinTable bins={bins} />
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
          }}>
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
          }}>
          <MdNavigateNext className="rounded-sm text-4xl hover:bg-slate-500/30 active:bg-slate-300/70" />
        </button>
      </div>
      {/* <Toast data={toast.message} isShow={toast.show} /> */}
    </div>
  );
}
