import useInventoryBins from "@/hooks/useInventoryBins";
import { buttonStyleDark, buttonStyleSubmit, InputStyle } from "@/styles/style";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading, AiOutlineMobile } from "react-icons/ai";
import { MdDriveFileMove, MdInventory2 } from "react-icons/md";
import { MdMoveDown } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import Input from "../Parts/Input";
import { mutate } from "swr";
import useCategories from "@/hooks/useCategories";
import { InventoryBins, InventoryPage } from "@/pages/api/inventory/bins/find";
import Link from "next/link";
import { DuplicateForm } from "@/pages/api/inventory/duplicate-products/update";
import { IoIosArrowDown, IoMdPrint } from "react-icons/io";
import { HiDuplicate } from "react-icons/hi";
import { FaBorderAll } from "react-icons/fa";

type Button = "Move Damage Product" | "Print Inventory" | "Organize Bin";
interface BinInventoryProps {}

export type MoveDamageForm = {
  open: boolean;
  binId: string;
  quantity: number;
  count: number;
  PO: string | "Default";
};

type Operation = "MOVE" | "SELECT" | "CANCEL" | "ACTION" | "SWAP";

type Actions = "MERGE" | "CLEAR";

type BinButton = {
  operation: Operation;
  id: string;
  action: Actions | "default";
};

export default function BinInventory({}: BinInventoryProps) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<InventoryPage>({
    category: "default",
    rackName: "default",
  });
  const { inventory } = useInventoryBins(page);
  const [moveDamageProduct, setMoveDamageProduct] = useState(false);
  const [POs, setPOs] = useState<string[]>([]);
  const [binButton, setBinButton] = useState<BinButton>({
    action: "default",
    id: "",
    operation: "ACTION",
  });

  const [moveDamageForm, setMoveDamageForm] = useState<MoveDamageForm>({
    open: false,
    binId: "",
    quantity: 0,
    count: 0,
    PO: "Default",
  });
  const [selectBinId, setSelectBinId] = useState("");

  const [inventoryActionState, setInventoryActionState] = useState({
    isOpen: false,
  });

  const [selectedBinIds, setSelectedBinIds] = useState<Record<string, string>>(
    {}
  );

  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleButtons, setVisibleButtons] = useState<{
    [key: number]: boolean;
  }>({});

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         const id = entry.target.getAttribute("data-id");
  //         if (!id) return;
  //         setVisibleButtons((prevState) => ({
  //           ...prevState,
  //           [id]: entry.isIntersecting,
  //         }));
  //       });
  //     },
  //     {
  //       root: document.querySelector(".parent"), // Parent element as the viewport
  //       threshold: 0.5, // 50% visibility to trigger
  //     }
  //   );

  //   // Copy the current refs to a local variable
  //   const currentElementRefs = elementRefs.current;

  //   // Observe elements
  //   currentElementRefs.forEach((el) => {
  //     if (el) observer.observe(el);
  //   });

  //   // Cleanup function
  //   return () => {
  //     currentElementRefs.forEach((el) => {
  //       if (el) observer.unobserve(el);
  //     });
  //   };
  // }, [moveDamageProduct]);
  // Only re-run when `moveDamageProduct` changes

  return (
    <div className="relative">
      <div className="flex h-full justify-between rounded-t-md  bg-white p-2">
        <MdInventory2
          size={30}
          className="flex h-full animate-emerge items-center justify-center drop-shadow-md"
        />

        <div className="flex gap-2 text-xs">
          <BinActionButtons
            states={{
              moveDamageProduct,
              setMoveDamageProduct,
              inventoryActionState,
              setInventoryActionState,
              page,
              setPage,
            }}
          />
        </div>
      </div>

      <div className="flex h-[45em] w-full flex-col gap-2 overflow-y-scroll rounded-b-md bg-slate-300 p-2">
        <div className="sticky top-0 flex  h-fit items-center justify-center rounded-md bg-slate-500 backdrop-blur-xl">
          <OrganizeBinForm
            states={{
              inventory,
              inventoryActionState,
              page,
              selectedBinIds,
              setInventoryActionState,
              setPage,
              setSelectedBinIds,
            }}
          />
        </div>
        {Array.isArray(inventory) &&
          inventory.map((v, i) => (
            <div
              className="parent flex flex-col rounded-md bg-white uppercase"
              key={v.bin.binId}
            >
              {/* Category and racks */}
              <div className="flex">
                <div className="rounded-y-md grid w-5/6 grid-cols-2 rounded-l-md  p-2 text-sm">
                  <ul className="">
                    <li>{v.product?.skuCode}</li>
                    <li>
                      {v.bin.category} {v.bin.rackName}
                      {v.bin.row}/{v.bin.shelfLevel}
                    </li>
                  </ul>

                  <div className="row-span-3">
                    <p className="break-all text-end text-xs">
                      Date: {String(v.product?.dateInfo.date).slice(0, 10)}
                    </p>
                    <h2 className="row-span-3 flex items-center justify-end p-2 text-center">
                      Quantity: {v.bin.count}
                    </h2>
                  </div>
                  <h2>{v.product?.productName}</h2>
                </div>
                <button
                  onClick={() => {
                    const operationFields: Record<Operation, () => void> = {
                      ACTION: () => {
                        setBinButton({
                          ...binButton,
                          id: v.bin.binId === binButton.id ? "" : v.bin.binId,
                          operation: "CANCEL",
                        });
                      },
                      CANCEL: () => {
                        setBinButton({
                          ...binButton,
                          id: v.bin.binId === binButton.id ? "" : v.bin.binId,
                          operation: "CANCEL",
                        });
                      },
                      MOVE: () => {},
                      SELECT: () => {},
                      SWAP: () => {
                        if (v.bin.binId === binButton.id) {
                          setLoading(true);
                          fetch("/api/inventory/bins/swap-products", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ page, selectedBinIds }),
                          })
                            .then(async (res) => {
                              const data = await res.json();
                              alert(data);
                            })
                            .finally(() => {
                              // setLoading((state: { [key: string]: boolean }) => ({
                              //   ...state,
                              //   swapProducts: false,
                              // }));

                              setBinButton((state) => {
                                return {
                                  ...state,
                                  id: "",
                                  operation: "ACTION",
                                };
                              });

                              setLoading(false);
                              setSelectedBinIds({});
                              mutate(
                                `/api/inventory/bins/find?category=${page.category}&rackName=${page.rackName}`
                              );
                            });
                        }
                      },
                    };

                    operationFields[binButton.operation]();
                  }}
                  className="border-l-1 flex w-3/6 select-none items-center justify-center rounded-r-md border border-y-0 border-r-0 p-2 hover:bg-sky-400 md:w-1/6"
                >
                  {binButton.id === v.bin.binId ? (
                    loading ? (
                      <AiOutlineLoading className="animate-spin" size={30} />
                    ) : (
                      binButton.operation
                    )
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
              </div>

              {/* body of bin */}
              <div
                className={`flex ${
                  binButton.id === v.bin.binId
                    ? "h-20 overflow-x-hidden border border-t-2 p-2"
                    : "h-0"
                } justify-between overflow-y-scroll rounded-md transition-all ease-in-out`}
              >
                <ul className={`flex flex-col break-all`}>
                  <li>Date: {String(v.product?.dateInfo.date).slice(0, 10)}</li>
                </ul>
                <div className="flex min-w-fit gap-2">
                  <select
                    name={v.bin.binId}
                    id={v.bin.binId}
                    value={selectedBinIds[v.bin.binId] || "default"}
                    onChange={(e) => {
                      setSelectedBinIds((state) => ({
                        ...state,
                        [v.bin.binId]: e.target.value,
                      }));
                      if (e.target.value) {
                        setBinButton((state) => {
                          return {
                            ...state,
                            operation: "SWAP",
                          };
                        });
                      }
                    }}
                    className={`${InputStyle} text-[.64rem]`}
                  >
                    <option value="default" disabled>
                      Select Bin
                    </option>
                    {inventory
                      .filter((value) => value.bin.binId !== v.bin.binId)
                      .map((v, i) => {
                        return (
                          <option
                            key={i}
                            value={v.bin.binId}
                          >{`${v.bin.rackName}${v.bin.row}/${v.bin.shelfLevel}`}</option>
                        );
                      })}
                  </select>
                  {v.bin.binId === binButton.id && (
                    <div>
                      <MdMoveDown
                        type="button"
                        size={50}
                        onClick={(e) => {
                          setPOs(v.product?.POs ?? []);
                          setMoveDamageForm({
                            ...moveDamageForm,
                            open: true,
                            binId: v.bin.binId,
                            count: v.bin.count,
                          });
                        }}
                        className={`relative ${
                          moveDamageProduct ? "animate-emerge" : "hidden"
                        }   hover:text-red-500`}
                      />
                    </div>
                  )}

                  <button
                    className={buttonStyleSubmit}
                    onClick={() => {
                      setSelectedBinIds((state) => ({
                        ...state,
                        [v.bin.binId]: "",
                      }));

                      setBinButton((state) => {
                        return {
                          ...state,
                          id: "",
                          operation: "CANCEL",
                        };
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div
        className={`  ${
          moveDamageForm.open ? "animate-emerge" : "hidden animate-fade"
        } absolute inset-0 flex  items-center justify-center rounded-md p-2  backdrop-blur-sm transition-all`}
      >
        <MoveDamageProduct
          states={{
            moveDamageForm,
            setMoveDamageForm,
            POs,
            setPOs,
          }}
        />
      </div>
    </div>
  );
}

interface BinActionButtonsProp {
  states: {
    moveDamageProduct: boolean;
    setMoveDamageProduct: React.Dispatch<React.SetStateAction<boolean>>;
    page: InventoryPage;
    setPage: React.Dispatch<React.SetStateAction<InventoryPage>>;
    inventoryActionState: { isOpen: boolean };
    setInventoryActionState: React.Dispatch<
      React.SetStateAction<{
        isOpen: boolean;
      }>
    >;
  };
}

function BinActionButtons({ states }: BinActionButtonsProp) {
  const {
    moveDamageProduct,
    setMoveDamageProduct,
    inventoryActionState,
    setInventoryActionState,
    page,
    setPage,
  } = states;
  const { isOpen } = inventoryActionState;
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  const buttons: Button[] = [
    "Move Damage Product",
    "Print Inventory",
    "Organize Bin",
  ];

  const renderIcon = (buttonName: string) => {
    const icons: Record<string, JSX.Element> = {
      "Move Damage Product": (
        <MdDriveFileMove size={20} className="sm:hidden" />
      ),
      "Print Inventory": <IoMdPrint size={20} className="sm:hidden" />,
      "Organize Bin": <FaBorderAll size={20} className="sm:hidden" />,
      default: <AiOutlineMobile size={20} className="sm:hidden" />,
    };

    const icon = icons[buttonName] || icons.default;

    return <>{icon}</>;
  };

  return (
    <>
      {buttons.map((buttonName, i) => {
        return (
          <div
            key={i}
            className={`flex flex-col gap-2 transition-all before:absolute before:text-white hover:before:content-[${buttonName}]`}
          >
            <button
              key={buttonName}
              onClick={() => {
                const fields: Record<Button, () => void> = {
                  "Move Damage Product": () => {
                    setMoveDamageProduct(!moveDamageProduct);
                  },
                  "Print Inventory": () => {
                    console.log("Button 2 clicked");
                    setLoadingButton(buttonName);
                    fetch(
                      `/api/logs/generate/bin-report?category=${page.category}&rackName=${page.rackName}`
                    )
                      .then(async (res) => {
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `Order_Report_bins_download_${Math.random()}.pdf`;
                        link.click();
                        URL.revokeObjectURL(url);
                      })
                      .catch((e) => {
                        console.error(e);
                      })
                      .finally(() => {
                        setLoadingButton(null);
                      });
                  },
                  "Organize Bin": () => {
                    console.log("Sorting Bins");
                    // setIsOpen(!isOpen);

                    setInventoryActionState((state) => ({
                      ...state,
                      isOpen: !inventoryActionState.isOpen,
                    }));
                  },
                };

                fields[buttonName]();
              }}
              className={`${buttonStyleDark} flex w-full items-center justify-center`}
            >
              {loadingButton === buttonName ? (
                <AiOutlineLoading
                  className="animate-spin text-center"
                  size={20}
                />
              ) : (
                <>
                  {renderIcon(buttonName)}

                  <span className="hidden sm:block">{buttonName}</span>
                </>
              )}
            </button>
          </div>
        );
      })}
    </>
  );
}

interface OrganizeFormProps {
  states: {
    page: InventoryPage;
    setPage: React.Dispatch<React.SetStateAction<InventoryPage>>;
    inventoryActionState: { isOpen: boolean };
    setInventoryActionState: React.Dispatch<
      React.SetStateAction<{
        isOpen: boolean;
      }>
    >;
    inventory: InventoryBins[] | undefined;
    setSelectedBinIds: React.Dispatch<
      React.SetStateAction<Record<string, string>>
    >;
    selectedBinIds: Record<string, string>;
  };
}

function OrganizeBinForm({ states }: OrganizeFormProps) {
  const { selectedBinIds, setSelectedBinIds, inventory } = states;
  console.log(selectedBinIds);
  const { categories, error, isLoading } = useCategories();
  const { page, setPage } = states;
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const [isButtonEnable, setIsButtonEnable] = useState(true);
  return (
    <div className="flex w-fit gap-2 p-2 uppercase text-black">
      <div className="flex gap-2">
        <select
          name="category"
          id="category"
          value={page.category}
          onChange={(e) => {
            if (!open) {
              setPage((prev) => ({ ...prev, category: "default" }));
            }

            setPage((prev) => ({
              ...prev,
              category: e.target.value,
              rackName: "default",
            }));
          }}
          className={`${InputStyle}  text-xs`}
        >
          <option value="default" disabled>
            Select Category
          </option>
          {Array.isArray(categories) &&
            categories.map((v, index) => (
              <option key={index} className="text-xs">
                {v.category}
              </option>
            ))}
        </select>
        <button
          onClick={() => setPage((prev) => ({ ...prev, category: "default" }))}
          className="flex items-center justify-center transition-all hover:scale-125"
        >
          x
        </button>
      </div>
      <div className="flex gap-2">
        {/* <label htmlFor="rackName" className="text-xs">
          Find RackName
        </label> */}
        <select
          name="rackName"
          id="rackName"
          value={page.rackName}
          onChange={(e) => {
            if (!open) {
              setPage((prev) => ({ ...prev, rackName: "default" }));
            }

            setPage((prev) => ({ ...prev, rackName: e.target.value }));
          }}
          className={`${InputStyle}  text-xs`}
        >
          <option value="default" disabled>
            Select Rack Name
          </option>
          {Array.isArray(categories) &&
            page.category &&
            categories
              .find((v) => {
                return v.category === page.category;
              })
              ?.rackNames.map((rackName, index) => {
                return (
                  <option key={index} value={rackName}>
                    {rackName}
                  </option>
                );
              })}
        </select>
        <button
          onClick={() => setPage((prev) => ({ ...prev, rackName: "default" }))}
          className="flex items-center justify-center transition-all hover:scale-125"
        >
          x
        </button>
      </div>

      {states.inventoryActionState.isOpen && (
        <div className="grid grid-cols-2 gap-2">
          <button
            id="mergeProducts"
            type="submit"
            className={`${buttonStyleSubmit} flex items-center justify-center uppercase`}
            onClick={() => {
              setLoading((state: { [key: string]: boolean }) => ({
                ...state,
                mergeProducts: true,
              }));

              fetch("/api/inventory/bins/merge-products-from-bins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(page),
              })
                .then(async (res) => {
                  const data = res.json();
                  alert(data);
                  setIsButtonEnable(false);
                })
                .catch((e) => alert(e))
                .finally(() => {
                  setLoading((state: { [key: string]: boolean }) => ({
                    ...state,
                    mergeProducts: false,
                  }));
                  mutate(
                    `/api/inventory/bins/find?category=${page.category}&rackName=${page.rackName}`
                  );
                });
            }}
          >
            {loading["mergeProducts"] ? (
              <AiOutlineLoading className="animate-spin " size={30} />
            ) : (
              "Merge Products"
            )}
          </button>
          <button
            id="moveProducts"
            type="submit"
            disabled={isButtonEnable}
            onMouseEnter={() => {
              if (isButtonEnable)
                alert(`button is disabled = ${isButtonEnable}`);
            }}
            onClick={() => {
              setLoading((state: { [key: string]: boolean }) => ({
                ...state,
                moveProducts: true,
              }));

              fetch("/api/inventory/bins/organize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(page),
              })
                .then(async (res) => {
                  const data = await res.json();
                  alert(data);
                  setIsButtonEnable(true);
                })
                .finally(() => {
                  setLoading((state: { [key: string]: boolean }) => ({
                    ...state,
                    moveProducts: false,
                  }));
                  mutate(
                    `/api/inventory/bins/find?category=${page.category}&rackName=${page.rackName}`
                  );
                });
            }}
            className={`${buttonStyleSubmit} flex items-center justify-center uppercase`}
          >
            {loading["moveProducts"] ? (
              <AiOutlineLoading className="animate-spin " size={30} />
            ) : (
              "Move Products"
            )}
          </button>
          {/* 
          <button
            id="swapProducts"
            type="submit"
            onClick={() => {
              setLoading((state: { [key: string]: boolean }) => ({
                ...state,
                swapProducts: true,
              }));

              fetch("/api/inventory/bins/swap-products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page, selectedBinIds }),
              })
                .then(async (res) => {
                  const data = await res.json();
                  alert(data);
                })
                .finally(() => {
                  setLoading((state: { [key: string]: boolean }) => ({
                    ...state,
                    swapProducts: false,
                  }));
                  setSelectedBinIds({});
                  mutate(
                    `/api/inventory/bins/find?category=${page.category}&rackName=${page.rackName}`
                  );
                });
            }}
            className={`${buttonStyleSubmit} row-span-2 flex items-center justify-center uppercase`}
          >
            {loading["swapProducts"] ? (
              <AiOutlineLoading className="animate-spin " size={30} />
            ) : (
              "Swap Products"
            )}
          </button> */}

          {/* <button
            onClick={() => setSelectedBinIds({})}
            className={`${buttonStyleSubmit} row-span-2 flex items-center justify-center uppercase`}
          >
            Clear Selected
          </button> */}
        </div>
      )}

      {/* <div>{JSON.stringify(selectedBinIds, null, 2)}</div> */}
    </div>
  );
}

interface MoveDamageProductProps {
  states: {
    moveDamageForm: MoveDamageForm;
    setMoveDamageForm: React.Dispatch<React.SetStateAction<MoveDamageForm>>;
    setPOs: React.Dispatch<React.SetStateAction<string[]>>;
    POs: string[];
  };
}

type DamageFormActions = "SEND TO DAMAGE BIN" | "REMOVE DUPLICATE PRODUCT";

function MoveDamageProduct({ states }: MoveDamageProductProps) {
  const [loading, setLoading] = useState(false);
  const { moveDamageForm, setMoveDamageForm, POs, setPOs } = states;
  const { open, count, PO, ...DamageForm } = moveDamageForm;
  const actions: DamageFormActions[] = [
    "REMOVE DUPLICATE PRODUCT",
    "SEND TO DAMAGE BIN",
  ];

  const [action, setAction] = useState<DamageFormActions | "default">(
    "default"
  );

  function getProductQuantityBasedOnPO(PO: string, binId: string) {
    console.log("fetching quantity");

    fetch("/api/inventory/assigned-products/get-quantity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ PO, binId }),
    })
      .then((res) => res.json())
      .then((data: { quantity: number }) =>
        setMoveDamageForm((prev) => ({
          ...prev,
          count: data.quantity,
        }))
      )
      .finally(() => {});
  }

  return (
    <form
      className="inset-0 flex h-fit w-[30em] flex-col gap-2 rounded-md bg-white/30 p-2 shadow-md backdrop-blur-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const actionFields: Record<DamageFormActions | "default", () => void> =
          {
            "REMOVE DUPLICATE PRODUCT": () => {
              setLoading(true);

              const Duplicateform: DuplicateForm = {
                binId: DamageForm.binId,
                quantity: DamageForm.quantity,
                PO,
              };

              fetch("/api/inventory/duplicate-products/update", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(Duplicateform),
              })
                .then(async (res) => {
                  res.ok && setPOs([]);
                  const data = await res.json();
                  alert(data);
                })
                .catch((e) => console.log(e))
                .finally(() => {
                  setLoading(false);
                  setMoveDamageForm({
                    ...moveDamageForm,
                    open: false,
                    PO: "Default",
                  });
                  setAction("default");
                  mutate("/api/inventory/bins/find");
                });
            },
            "SEND TO DAMAGE BIN": () => {
              setLoading(true);
              fetch("/api/inventory/damage-products/update", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...DamageForm, PO }),
              })
                .then(async (res) => {
                  const data = await res.json();
                  alert(data);
                })
                .catch((e) => console.log(e))
                .finally(() => {
                  setLoading(false);
                  setMoveDamageForm({
                    ...moveDamageForm,
                    open: false,
                    PO: "Default",
                  });
                  setAction("default");
                  mutate("/api/inventory/bins/find");
                });
            },
            default: () => {
              alert(`No Action Selected`);
            },
          };
        actionFields[action]();
      }}
    >
      <RxCross2
        type="button"
        onClick={() => {
          setMoveDamageForm({
            ...moveDamageForm,
            open: false,
            PO: "Default",
            quantity: 0,
          });
          setLoading(false);

          setAction("default");
        }}
      />

      <select
        name={action}
        value={action}
        onChange={(e) => {
          const newAction = e.target.value as DamageFormActions | "default";
          setAction(newAction);
        }}
        className={`${InputStyle} ${
          action === "default" ? "animate-bounce" : ""
        } uppercase `}
      >
        <option value={"default"} disabled className="text-center">
          Select Action
        </option>
        {Array.isArray(actions) &&
          actions.map((action, i) => {
            return (
              <option key={i} value={action} className="text-center">
                {action}
              </option>
            );
          })}
      </select>

      <div className="flex flex-col gap-2">
        <select
          id="PO"
          name={PO}
          value={PO}
          onChange={(e) => {
            const PO = e.target.value;
            console.log(PO);
            setMoveDamageForm({ ...moveDamageForm, PO, quantity: 0 });
            getProductQuantityBasedOnPO(PO, DamageForm.binId);
          }}
          className={InputStyle}
        >
          <option value="Default" disabled>
            Select PO
          </option>

          {Array.isArray(POs) &&
            POs.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
        </select>

        <Input
          attributes={{
            input: {
              id: "quantity",
              name: "quantity",
              type: "number",
              max: count,
              min: 0,
              value: DamageForm.quantity,
              onChange: (e) => {
                const { value } = e.target;
                setMoveDamageForm({
                  ...moveDamageForm,
                  quantity: parseInt(value) > count ? 0 : parseInt(value),
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
        className={`${buttonStyleSubmit} flex items-center justify-center uppercase`}
      >
        {loading ? (
          <AiOutlineLoading className="animate-spin " size={30} />
        ) : (
          "Confirm"
        )}
      </button>
      <>{JSON.stringify(DamageForm)}</>
    </form>
  );
}

// <div
//   ref={(el) => (elementRefs.current[i] = el)}
//   key={v.bin.binId}
//   data-id={i}
//   onClick={() => {
//     const barcodeId = v.product?.barcodeId ?? "";
//     navigator.clipboard
//       .writeText(barcodeId)
//       .then(() => console.log("text copied!"))
//       .catch((e) => console.log(e));
//     setSelectBinId(
//       selectBinId !== v.bin.binId ? v.bin.binId : ""
//     );
//   }}
//   className={`
//     ${selectBinId === v.bin.binId ? "h-28" : ""}
//   ${
//     moveDamageProduct ||
//     (inventoryActionState.isOpen && !moveDamageProduct)
//       ? "grid-cols-3"
//       : "h-12 grid-cols-2"
//   } grid  w-full flex-none rounded-md bg-white uppercase shadow-md transition-all hover:bg-sky-300`}
// >
//   <h1 className="flex items-center justify-center border border-black  text-center">{`Rack: ${v.bin.rackName}${v.bin.row}/${v.bin.shelfLevel}`}</h1>
//   <h1 className="flex items-center justify-center  border border-black text-center">
//     Count: {v.bin.count}
//   </h1>

// {visibleButtons[i] && (
//   <div
//     className={`

//        ${selectBinId === v.bin.binId ? "h-28" : ""}
//       ${
//         moveDamageProduct ||
//         (inventoryActionState.isOpen && !moveDamageProduct)
//           ? "row-span-2 h-12"
//           : "hidden"
//       } flex w-full items-center justify-center transition-all`}
//     onClick={(e) => e.stopPropagation()}
//   >
//     <MdMoveDown
//       type="button"
//       size={50}
//       onClick={(e) => {
//         setPOs(v.product?.POs ?? []);
//         setMoveDamageForm({
//           ...moveDamageForm,
//           open: true,
//           binId: v.bin.binId,
//           count: v.bin.count,
//         });
//       }}
//       className={`relative ${
//         moveDamageProduct ? "animate-emerge" : "hidden"
//       }   hover:text-white`}
//     />

//     <select
//       name={v.bin.binId}
//       id={v.bin.binId}
//       value={selectedBinIds[v.bin.binId] || "default"}
//       onChange={(e) =>
//         setSelectedBinIds((state) => ({
//           ...state,
//           [v.bin.binId]: e.target.value,
//         }))
//       }
//       className={`${InputStyle}
//       ${
//         inventoryActionState.isOpen && !moveDamageProduct
//           ? "animate-emerge"
//           : "hidden"
//       }  text-[.64rem] `}
//     >
//       <option value="default" disabled>
//         Select Bin
//       </option>
//       {inventory
//         .filter((value) => value.bin.binId !== v.bin.binId)
//         .map((v, i) => {
//           return (
//             <option
//               key={i}
//               value={v.bin.binId}
//             >{`${v.bin.rackName}${v.bin.row}/${v.bin.shelfLevel}`}</option>
//           );
//         })}
//     </select>
//   </div>
// )}

//   <ul
//     className={`${
//       selectBinId === v.bin.binId
//         ? "col-span-2 opacity-100"
//         : "hidden"
//     } col-span-1 flex flex-col  flex-wrap items-start justify-start gap-2 break-all  p-2 text-start transition duration-500`}
//   >
//     <li>Bin Id: {v.bin.binId}</li>
//     <li>Product: {v.product?.productName}</li>
//     <li>Category: {v.bin.category}</li>
//   </ul>

// </div>
