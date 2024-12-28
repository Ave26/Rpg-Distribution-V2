import {
  AssignedProducts,
  DamageBins,
} from "@/pages/api/inventory/assigned-products/find";
import useAssignedProducts from "@/hooks/useAssignedProducts";
import { AiOutlineLoading } from "react-icons/ai";
import { FaProductHunt } from "react-icons/fa6";
import { IoIosArrowDown, IoMdPrint } from "react-icons/io";
import {
  buttonStyleDark,
  buttonStyleEdge,
  buttonStyleSubmit,
  InputStyle,
} from "@/styles/style";
import { RxCross2 } from "react-icons/rx";
import { GiGroundbreaker } from "react-icons/gi";
import React, { useState } from "react";
import Input from "../Parts/Input";
import Search from "../Parts/Search";
import { CgSearch } from "react-icons/cg";
import Link from "next/link";
import { QueryDamageBin } from "@/pages/api/logs/generate/bin-damage-report";

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
        <div className="flex h-full gap-2">
          <div className="flex flex-none items-center justify-center">
            <a
              href={`/api/logs/generate/bin-damage-report`}
              // className="flex w-fit flex-col gap-2  hover:text-blue-800"
              className={`${buttonStyleDark}`}
            >
              <span className="hidden sm:block">Print Damage Report</span>
              <IoMdPrint size={20} className="sm:hidden" />
            </a>
          </div>
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
                    productName={product.productName}
                    damageBins={product.damageBins}
                    key={product.skuCode}
                    skuCode={product.skuCode}
                  />
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}

type Operation =
  | "Generate Report"
  | "Select Action"
  | "Cancel"
  | "Update Damage Report";

export type Actions =
  | "For Replacement Client" // Outbound
  | "For Return Supplier" // Inbound
  | "For Return Home" // home
  | "For Replacement" // Inventory
  | "Make Report";

export type DamageBinButton = {
  operation: Operation;
  id: string;
  action: Actions | "default";
};

type ViewDamageBinsProps = {
  damageBins: DamageBins[];
  productName: string;
  skuCode: string;
};

function ViewDamageBins({
  damageBins,
  productName,
  skuCode,
}: ViewDamageBinsProps) {
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
                  <h1>Product Name: {productName}</h1>
                  <h1>
                    Location: {row} / {shelf}
                  </h1>
                  <h1>Quantity: {damageBin.count}</h1>
                  <div className="flex w-full gap-1">
                    Purchase Order:
                    {damageBin.purchaseOrder.map((v, i) => (
                      <h1 key={i}>{v}</h1>
                    ))}
                  </div>
                  <h1>Supplier Name: {damageBin.supplierName}</h1>
                  <h1>Action: {damageBin.action}</h1>
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

                          const form: QueryDamageBin = {
                            damageBinId: damageBin.id,
                            skuCode,
                          };

                          fetch("/api/logs/generate/bin-damage-report", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(form),
                          })
                            .then(async (res) => {
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `Order_Report_bins_download_${damageBin.id}.pdf`;
                              link.click();
                              URL.revokeObjectURL(url);
                              // res.ok && alert("success");
                            })
                            .catch((e) => {
                              console.error(e);
                            })
                            .finally(() => {
                              setLoading(false);
                              setDamageBinButton((prevState) => ({
                                ...prevState,
                                operation: "Select Action",
                                action: "default",
                              }));
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
                      "Update Damage Report": () => {
                        console.log("updating damge bin");
                        if (damageBin.id === damageBinButton.id) {
                          setLoading(true);

                          fetch("/api/logs/report/update/damage-bin", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(damageBinButton),
                          })
                            .then(async (res) => {
                              const data = await res.json();
                              alert(`${res.ok ? "success" : ""}, ${data}`);
                            })
                            .catch((e) => {
                              console.error(e);
                            })
                            .finally(() => {
                              setLoading(false);
                              setDamageBinButton((prevState) => ({
                                ...prevState,
                                operation: "Update Damage Report",
                              }));
                            });
                        }
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
    "For Replacement Client", // Outbound
    "For Return Supplier", // Inbound
    "For Return Home", // home
    "For Replacement", // Inventory
    "Make Report",
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
                : newAction === "Make Report"
                ? "Generate Report"
                : "Update Damage Report",
          });
        }}
        className={`${InputStyle}`}
      >
        <option value={"default"} disabled>
          Select Category
        </option>
        {Array.isArray(actions) &&
          actions.map((action, i) => {
            return (
              <option key={i} value={action}>
                {action}
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
    </>
  );
}
