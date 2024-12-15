import useInventoryBins from "@/hooks/useInventoryBins";
import { buttonStyleSubmit, InputStyle } from "@/styles/style";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MdInventory2 } from "react-icons/md";
import { MdMoveDown } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import Input from "../Parts/Input";
import { mutate } from "swr";
import useCategories from "@/hooks/useCategories";
import { InventoryPage } from "@/pages/api/inventory/bins/find";

type Button = "Move Damage Product" | "Print Inventory" | "Organize Bin";
interface BinInventoryProps {}
interface BinActionButtonsProp {
  states: {
    moveDamageProduct: boolean;
    setMoveDamageProduct: React.Dispatch<React.SetStateAction<boolean>>;

    inventoryActionState: { isOpen: boolean };
    setInventoryActionState: React.Dispatch<
      React.SetStateAction<{
        isOpen: boolean;
      }>
    >;
  };
}

interface MoveDamageProductProps {
  states: {
    moveDamageForm: MoveDamageForm;
    setMoveDamageForm: React.Dispatch<React.SetStateAction<MoveDamageForm>>;
    setPOs: React.Dispatch<React.SetStateAction<string[]>>;
    POs: string[];
  };
}

export type MoveDamageForm = {
  open: boolean;
  binId: string;
  quantity: number;
  count: number;
  PO: string | "Default";
};

export default function BinInventory({}: BinInventoryProps) {
  const [page, setPage] = useState<InventoryPage>({
    category: "default",
    rackName: "default",
  });

  const { inventory } = useInventoryBins(page);
  const [moveDamageProduct, setMoveDamageProduct] = useState(false);
  const [POs, setPOs] = useState<string[]>([]);
  const [moveDamageForm, setMoveDamageForm] = useState<MoveDamageForm>({
    open: false,
    binId: "",
    quantity: 0,
    count: 0,
    PO: "Default",
  });

  const elementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleButtons, setVisibleButtons] = useState<{
    [key: number]: boolean;
  }>({});
  // const [isOpen, setIsOpen] = useState(false);
  const [inventoryActionState, setInventoryActionState] = useState({
    isOpen: false,
  });
  const [selectedBinIds, setSelectedBinIds] = useState<Record<string, string>>(
    {}
  );
  console.log(Object.values(selectedBinIds).map((value) => value));
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          if (!id) return;
          setVisibleButtons((prevState) => ({
            ...prevState,
            [id]: entry.isIntersecting,
          }));
        });
      },
      {
        root: document.querySelector(".parent"), // Parent element as the viewport
        threshold: 0.5, // 50% visibility to trigger
      }
    );

    elementRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elementRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [moveDamageProduct]);

  const handleTagClick = async (tagName: string) => {
    try {
      await navigator.clipboard.writeText(tagName); // Copy to clipboard
      // alert(`${tagName} copied! You can now paste it in the input field.`);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // alert("Failed to copy. Please try again.");
    }
  };

  return (
    <div className="relative">
      <div className="flex h-[8%] justify-between rounded-t-md  bg-white p-2">
        <MdInventory2
          size={30}
          className="flex h-full animate-emerge items-center justify-center drop-shadow-md"
        />
        <div className="flex gap-2">
          <BinActionButtons
            states={{
              moveDamageProduct,
              setMoveDamageProduct,
              inventoryActionState,
              setInventoryActionState,
            }}
          />
        </div>
      </div>

      <div className="flex w-full justify-center gap-1">
        <div className="parent relative flex h-[45em] w-5/6 flex-col items-start gap-2 overflow-y-scroll rounded-bl-md bg-slate-300 p-4 backdrop-blur-sm">
          {Array.isArray(inventory) &&
            inventory.map((v, i) => (
              <div
                key={v.bin.binId}
                ref={(el) => (elementRefs.current[i] = el)}
                data-id={i}
                className="flex gap-2"
                onClick={() => {
                  const barcodeId = v.product?.barcodeId ?? "";
                  handleTagClick(barcodeId);
                }}
              >
                <div
                  key={i}
                  className="flex h-[4em] w-full flex-none select-none items-center justify-center gap-2 rounded-md bg-white p-2 shadow-md transition-all hover:bg-sky-300 md:w-[45em]"
                >
                  <div className="flex gap-2 uppercase">
                    {/* <h1>BarcodeId: {v.product?.barcodeId}</h1> */}
                    <h1 className="break-all">BinId: {v.bin.binId}</h1>
                    <h1>Product: {v.product?.productName}</h1>
                    <h1>{`Rack: ${v.bin.rackName}${v.bin.row}/${v.bin.shelfLevel}`}</h1>
                    <h1>Category: {v.bin.category}</h1>
                    <h1>
                      {v.product?.dateInfo?.type}:
                      {v.product?.dateInfo?.date?.toLocaleString().slice(0, 10)}
                    </h1>
                    <h1>Count: {v.bin.count}</h1>
                  </div>
                </div>
                {visibleButtons[i] && (
                  <select
                    className={`${InputStyle} text-[.64rem] ${
                      inventoryActionState.isOpen && !moveDamageProduct
                        ? "animate-emerge"
                        : "hidden"
                    }`}
                    key={v.bin.binId}
                    name={v.bin.binId}
                    id={v.bin.binId}
                    value={selectedBinIds[v.bin.binId] || "default"}
                    onChange={(e) =>
                      setSelectedBinIds((state) => ({
                        ...state,
                        [v.bin.binId]: e.target.value,
                      }))
                    }
                  >
                    <option value="default" disabled>
                      Select Bin
                    </option>
                    {inventory
                      .filter(
                        (value) => value.bin.binId !== v.bin.binId
                        // !Object.values(selectedBinIds).includes(
                        //   value.bin.binId
                        // )
                      )
                      .map((v) => {
                        return (
                          <option
                            value={v.bin.binId}
                          >{`${v.bin.rackName}${v.bin.row}/${v.bin.shelfLevel}`}</option>
                        );
                      })}
                  </select>
                )}
                {visibleButtons[i] && (
                  <>
                    <MdMoveDown
                      type="button"
                      size={50}
                      onClick={() => {
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
                      } ${buttonStyleSubmit}`}
                    />
                  </>
                )}
              </div>
            ))}
        </div>

        <div className="w-1/2  rounded-br-md bg-slate-300">
          <OrganizeBinForm
            states={{
              page,
              setPage,
              inventoryActionState,
              setInventoryActionState,
              selectedBinIds,
              setSelectedBinIds,
            }}
          />
        </div>
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

function BinActionButtons({ states }: BinActionButtonsProp) {
  const {
    moveDamageProduct,
    setMoveDamageProduct,
    inventoryActionState,
    setInventoryActionState,
  } = states;
  const { isOpen } = inventoryActionState;
  const buttons: Button[] = [
    "Move Damage Product",
    "Print Inventory",
    "Organize Bin",
  ];

  return (
    <>
      {buttons.map((btnName, i) => {
        return (
          <div className="flex flex-col gap-2 transition-all">
            <button
              key={btnName}
              onClick={() => {
                const fields: Record<Button, () => void> = {
                  "Move Damage Product": () => {
                    setMoveDamageProduct(!moveDamageProduct);
                  },
                  "Print Inventory": () => {
                    console.log("Button 2 clicked");
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

                fields[btnName]();
              }}
              className={
                "flex-shrink rounded-md bg-slate-700 p-2  text-center uppercase text-white active:scale-105"
              }
            >
              {btnName}
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

    setSelectedBinIds: React.Dispatch<
      React.SetStateAction<Record<string, string>>
    >;
    selectedBinIds: Record<string, string>;
    // isOpen: boolean;
    // setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

function OrganizeBinForm({ states }: OrganizeFormProps) {
  const { selectedBinIds, setSelectedBinIds } = states;
  console.log(selectedBinIds);
  const { categories, error, isLoading } = useCategories();
  const { page, setPage } = states;
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const [isButtonEnable, setIsButtonEnable] = useState(true);
  return (
    <div className="flex flex-col gap-2 p-2 uppercase text-black">
      <div className="flex gap-2">
        <label htmlFor="category" className="text-xs">
          Find Category
        </label>
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
            categories.map((v) => (
              <option className="text-xs">{v.category}</option>
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
        <label htmlFor="rackName" className="text-xs">
          Find RackName
        </label>
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
              ?.rackNames.map((rackName) => {
                return <option value={rackName}>{rackName}</option>;
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
            onMouseOver={() => {
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
              1;
            }}
            className={`${buttonStyleSubmit} row-span-2 flex items-center justify-center uppercase`}
          >
            {loading["swapProducts"] ? (
              <AiOutlineLoading className="animate-spin " size={30} />
            ) : (
              "Swap Products"
            )}
          </button>

          <button
            onClick={() => setSelectedBinIds({})}
            className={`${buttonStyleSubmit} row-span-2 flex items-center justify-center uppercase`}
          >
            Clear Selected
          </button>
        </div>
      )}

      <div>{JSON.stringify(selectedBinIds, null, 2)}</div>
    </div>
  );
}

function MoveDamageProduct({ states }: MoveDamageProductProps) {
  const [loading, setLoading] = useState(false);
  const { moveDamageForm, setMoveDamageForm, POs, setPOs } = states;
  const { open, count, PO, ...DamageForm } = moveDamageForm;
  const [quantity, setQuantity] = useState(0);

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

        console.log("submitting");
        setLoading(true);
        fetch("/api/inventory/damage-products/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...DamageForm, PO }),
        })
          .then((res) => res.json())
          .catch((e) => console.log(e))
          .finally(() => {
            setLoading(false);
            setMoveDamageForm({
              ...moveDamageForm,
              open: false,
              PO: "Default",
            });
            mutate("/api/inventory/bins/find");
          });
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
        }}
      />

      <h1 className="mb-3 border border-dashed border-black p-2 text-center font-black uppercase">
        send to damage bin
      </h1>

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
