import { DamageBins } from "@/pages/api/inventory/assigned-products/find";
import useAssignedProducts from "@/hooks/useAssignedProducts";
import { AiOutlineLoading } from "react-icons/ai";
import { FaProductHunt } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { buttonStyleSubmit, InputStyle } from "@/styles/style";
import { RxCross2 } from "react-icons/rx";
import { GiGroundbreaker } from "react-icons/gi";
import React, { useState } from "react";
import Input from "../Parts/Input";
import Search from "../Parts/Search";
import { CgSearch } from "react-icons/cg";

export default function DamageInventory() {
  const { assignedProducts } = useAssignedProducts();
  const [selected, setSelected] = useState("");
  return (
    <>
      <div className="flex h-[8%] justify-between rounded-t-md bg-white p-2">
        <GiGroundbreaker
          size={30}
          className="flex h-full animate-emerge  items-center justify-center text-red-600"
        />
        <div className="flex">
          <Input
            attributes={{
              input: {},

              label: {
                children: "search sku",
              },
            }}
          />
          <CgSearch
            size={30}
            onClick={() => {
              console.log("click");
            }}
            className="flex h-full w-fit select-none items-center justify-center rounded-r-sm active:scale-110"
          />
        </div>
      </div>
      <div className="flex h-[45em] w-full flex-col items-center gap-2 overflow-y-scroll rounded-b-md bg-slate-300 p-4">
        {Array.isArray(assignedProducts) &&
          assignedProducts?.map((product) => {
            return (
              <>
                <button
                  className="flex h-[4em] w-full flex-none select-none  flex-col items-center justify-center rounded-md bg-white p-2 shadow-md hover:bg-sky-300 md:w-[45em]"
                  onClick={() => {
                    if (selected === product.skuCode) {
                      setSelected("");
                    } else {
                      setSelected(product.skuCode);
                    }
                  }}
                >
                  <h1>{product.skuCode}</h1>
                </button>
                <div
                  className={`${
                    selected === product.skuCode
                      ? "h-[30em] p-2"
                      : "h-0 border-hidden"
                  }  flex w-full flex-none flex-col gap-2 overflow-scroll bg-slate-700 shadow-md transition-all md:w-[45em]`}
                >
                  <ViewDamageBins
                    damageBins={product.damageBins}
                    key={product.skuCode}
                  />
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}

type Operation = "Generate Report" | "Select Action" | "Cancel";

type Actions =
  | "For Return Supplier"
  | "For Return Home"
  | "For Replacement Client"
  | "For Replacement Supplier";

export type DamageBinButton = {
  operation: Operation;
  id: string;
  action: Actions | "default";
};

type ViewDamageBinsProps = {
  damageBins: DamageBins[];
};

function ViewDamageBins({ damageBins }: ViewDamageBinsProps) {
  const [loading, setLoading] = useState(false);
  const [damageBinButton, setDamageBinButton] = useState<DamageBinButton>({
    id: "",
    operation: "Select Action",
    action: "default",
  });

  return (
    <>
      {Array.isArray(damageBins) &&
        damageBins.map((damageBin) => {
          const { row, shelf } = damageBin;
          return (
            <div
              className="flex flex-col rounded-md bg-white"
              key={damageBin.id}
            >
              <div className="flex">
                <div className="rounded-y-md w-5/6 rounded-l-md p-2">
                  <h1>Type: {damageBin.category}</h1>
                  <h1>
                    Location: {row} / {shelf}
                  </h1>
                  <h1>Quantity: {damageBin.count}</h1>
                  <h1>Purchase Order: [PO-1,PO-2,3,4,5,6]</h1>
                  <h1>Supplier Name: {damageBin.supplierName}</h1>
                </div>

                <button
                  className={
                    "border-l-1 flex w-3/6 select-none items-center justify-center rounded-r-md border border-y-0 border-r-0 p-2 hover:bg-sky-400 md:w-1/6"
                  }
                  onClick={() => {
                    const operationFields: Record<Operation, () => void> = {
                      Cancel: () => {},
                      "Generate Report": () => {
                        if (damageBin.id === damageBinButton.id) {
                          setLoading(true);

                          fetch("/api/inventory/damageReport/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(damageBinButton),
                          })
                            .then((res) => {
                              res.ok && console.log("success");
                            })
                            .catch((e) => {
                              console.error(e);
                            })
                            .finally(() => {
                              setLoading(false);
                            });
                        }
                      },
                      "Select Action": () => {
                        console.log("select action triggered");

                        setDamageBinButton({
                          ...damageBinButton,
                          id:
                            damageBin.id === damageBinButton.id
                              ? ""
                              : damageBin.id,
                          operation: "Select Action",
                        });
                      },
                    };
                    operationFields[damageBinButton.operation]();
                  }}
                >
                  {damageBinButton.id === damageBin.id ? (
                    loading ? (
                      <AiOutlineLoading className="animate-spin" size={30} />
                    ) : (
                      damageBinButton.operation
                    )
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
              </div>
              <div
                className={`flex ${
                  damageBinButton.id === damageBin.id ? "h-10" : "h-0"
                }  overflow-hidden rounded-md transition-all ease-in-out`}
              >
                <SelectAction
                  damageBinButton={damageBinButton}
                  setDamageBinButton={setDamageBinButton}
                />
              </div>
            </div>
          );
        })}
      {JSON.stringify(damageBinButton, null, 2)}
    </>
  );
}

interface SelectActionProps {
  damageBinButton: DamageBinButton;
  setDamageBinButton: React.Dispatch<React.SetStateAction<DamageBinButton>>;
}

function SelectAction({
  damageBinButton,
  setDamageBinButton,
}: SelectActionProps) {
  const actions: Actions[] | "default" = [
    "For Replacement Client",
    "For Replacement Supplier",
    "For Return Home",
    "For Return Supplier",
  ];

  return (
    <>
      <select
        name={damageBinButton.action}
        value={damageBinButton.action}
        onChange={(e) => {
          const newAction = e.target.value as Actions | "default";
          setDamageBinButton({
            ...damageBinButton,
            action: newAction,
            operation:
              newAction === "default"
                ? damageBinButton.operation
                : "Generate Report",
          });
        }}
        className={`${InputStyle}`}
      >
        <option value={"default"} disabled>
          Select Category
        </option>
        {Array.isArray(actions) &&
          actions.map((v) => {
            return (
              <option key={v} value={v}>
                {v}
              </option>
            );
          })}
      </select>
      <RxCross2
        type="button"
        className="h-full w-fit transition-all ease-out active:scale-125"
        onClick={() => {
          setDamageBinButton({
            ...damageBinButton,
            action: "default",
            operation: "Select Action",
          });
        }}
      />

      {/* <button className={buttonStyle}>For Return (Supplier)</button>
  <button className={buttonStyle}>For Return (Home)</button>
  <button className={buttonStyle}>
    For Replacement (Client)
  </button>
  <button className={buttonStyle}>
    For Replacement (Supplier)
  </button> */}
    </>
  );
}
