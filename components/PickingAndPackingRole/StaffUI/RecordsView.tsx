import React, { SetStateAction, useEffect, useState } from "react";
import {
  TBinLocations,
  TOrderedProductsWBinLocations,
  TRecords,
  TTrucks,
} from "../PickingAndPackingType";
import { useMyContext } from "@/contexts/AuthenticationContext";
import RecordSelection from "../../ReusableComponent/RecordSelection";
import { TToast } from "../Toast";
import { buttonStyleSubmit } from "@/styles/style";
import Input from "@/components/Parts/Input";
import { UserRole } from "@prisma/client";
import LoadRecordButton from "./LoadRecordButton";
import { RxCross2 } from "react-icons/rx";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { mutate } from "swr";

interface TRecordsViewProps {
  truck: TTrucks;
  states: {
    selectedId: string;
    setToast: React.Dispatch<React.SetStateAction<TToast>>;
    toast: TToast;
  };
}

export type ReportDamageProduct = {
  open: boolean;
  count: number;
  orderedProducts: OrderedProductType[]; // binLocationId, skuName
};

export type OrderedProductType = {
  skuName: string;
  binLocationId: string;
  threshold: number; //
  quantity: number;

  orderedProductId: string;
};

export default function RecordsView({ truck, states }: TRecordsViewProps) {
  const { selectedId, setToast, toast } = states;

  const [reportDamageForm, setReportDamageForm] = useState<ReportDamageProduct>(
    {
      count: 0,
      open: false,
      orderedProducts: [],
    }
  );
  const [record, setRecord] = useState<TRecords | null>(null);
  const [recordState, setRecordState] = useState({
    open: false,
  });

  return (
    <div
      className={`mb-2 flex ${
        selectedId === truck.id
          ? "h-full overflow-y-scroll border border-y-0 border-dotted border-x-slate-900 py-2"
          : "hidden max-h-0 overflow-hidden"
      } w-full flex-col items-center justify-center rounded-sm border border-transparent transition-all`}
    >
      <Records
        truck={truck}
        states={{
          setRecord,
          setRecordState,
          reportDamageForm,
          setReportDamageForm,
          record,
          setToast,
          toast,
          selectedId,
        }}
      />
      <div
        className={`  ${
          recordState.open ? "animate-emerge" : "hidden animate-fade"
        } absolute inset-0 flex  h-full items-center justify-center rounded-md p-2 backdrop-blur-sm transition-all`}
      >
        <ReportDamageForm
          states={{
            record,
            reportDamageForm,
            setReportDamageForm,
            recordState,
            setRecordState,
            truck,
          }}
        />
      </div>
    </div>
  );
}

interface RecordsProps {
  truck: TTrucks;
  states: {
    selectedId: string;
    setToast: React.Dispatch<React.SetStateAction<TToast>>;
    toast: TToast;
    setRecordState: React.Dispatch<React.SetStateAction<RecordState>>;
    setRecord: React.Dispatch<React.SetStateAction<TRecords | null>>;
    record: TRecords | null;
    setReportDamageForm: React.Dispatch<
      React.SetStateAction<ReportDamageProduct>
    >;
    reportDamageForm: ReportDamageProduct;
  };
}

type RecordState = {
  open: boolean;
};

export type ToastData = {
  message: string;
  show: boolean;
};
function Records({ truck, states }: RecordsProps) {
  const {
    selectedId,
    setToast,
    toast,
    setRecord,
    setRecordState,
    reportDamageForm,
    setReportDamageForm,
    record,
  } = states;
  const { globalState } = useMyContext();
  const role: UserRole | undefined = globalState?.verifiedToken?.roles;
  console.log(record);
  const [open, setOpen] = useState(false);
  const [openRecordId, setOpenRecordId] = useState("");
  const [toastData, setToastData] = useState<ToastData>({
    message: "",
    show: false,
  });

  useEffect(() => {
    if (record) {
      const result = record.orderedProducts.reduce(
        (acc, initial) => {
          acc.total += initial.binLocations.reduce((acc, initial) => {
            return (acc += initial.quantity * initial.stockKeepingUnit.weight);
          }, 0);
          return acc;
        },
        { total: 0 }
      );

      const { total } = result;
      console.log(total);
    }
  }, [record]);

  if (!role) return <AiOutlineLoading />;
  return (
    <>
      {Array.isArray(truck.records) &&
        truck.records.map((r, i) => {
          console.log(record);

          return (
            <div
              key={r.id}
              className="flex w-full flex-col gap-2 border border-black border-x-transparent p-2"
            >
              <RecordSelection
                key={r.id}
                data={{ truck, record: r }}
                states={{ reportDamageForm, setReportDamageForm }}
              />

              {role === "Driver" && (
                <div className="sticky bottom-0 flex gap-2">
                  {openRecordId === r.id ? (
                    <HandPackage
                      key={i}
                      states={{
                        setOpenRecordId,
                        record,
                        setRecord,
                        truckId: truck.id,
                        open,
                        setOpen,
                        selectedId,

                        setToast,
                        toast,
                      }}
                    />
                  ) : (
                    <button
                      key={i}
                      className={`${buttonStyleSubmit} font-bold uppercase`}
                      type="button"
                      onClick={() => {
                        setRecord(r);
                        setOpenRecordId(r.id);
                        setOpen(true);
                      }}
                    >
                      hand package
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${buttonStyleSubmit} font-bold uppercase`}
                    onClick={() => {
                      setRecordState((v) => ({ ...v, open: true }));
                      setRecord(r);
                    }}
                  >
                    Report Damage Product
                  </button>
                </div>
              )}

              {role === "Staff" && (
                <LoadRecordButton
                  record={r}
                  truck={truck}
                  orderedProducts={r.orderedProducts}
                  states={{ setToastData, toastData }}
                />
              )}
            </div>
          );
        })}
    </>
  );
}

interface HandPackageProps {
  states: {
    record: TRecords | null;
    setRecord: (value: React.SetStateAction<TRecords | null>) => void;
    truckId: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    selectedId: string;
    setToast: React.Dispatch<React.SetStateAction<TToast>>;
    toast: TToast;
    setOpenRecordId: React.Dispatch<React.SetStateAction<string>>;
  };
}

function HandPackage({ states }: HandPackageProps) {
  const { record, setRecord, truckId, setOpen, setOpenRecordId } = states;
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<{
    totalNetW: number;
    productIds: string[];
  } | null>({
    productIds: [],
    totalNetW: 0,
  });
  useEffect(() => {
    if (record) {
      const data = record.orderedProducts.reduce(
        (acc: { totalNetW: number; productIds: string[] }, op) => {
          const result = op.binLocations.reduce(
            (acc: { NetW: number; ids: string[] }, bl) => {
              const ids = bl.assignedProducts
                .filter((ap) => ap.quality === "Good")
                .reduce((acc: string[], ap) => {
                  acc.push(ap.id);
                  return acc;
                }, []);

              acc.NetW += bl.stockKeepingUnit.weight * ids.length;
              acc.ids.push(...ids);
              return acc;
            },
            { NetW: 0, ids: [] }
          );

          acc.totalNetW += result.NetW;
          acc.productIds.push(...result.ids);
          return acc;
        },

        { totalNetW: 0, productIds: [] }
      );

      setProductData(data);
    }

    return () => {
      setProductData(null);
    };
  }, [record]);

  return (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-blue-600">
      {loading ? (
        <AiOutlineLoading
          className="h-10 w-10 flex-grow-0 animate-spin p-2"
          size={30}
        />
      ) : (
        <div className="flex gap-2">
          <button
            className={`${buttonStyleSubmit} font-bold uppercase`}
            onClick={() => {
              console.log("cancel executed");
              setOpen(false);
              setOpenRecordId("");
              if (record) return setRecord(null); // Correctly reset the record
            }}
          >
            Cancel
          </button>
          <button
            className={`${buttonStyleSubmit} font-bold uppercase`}
            onClick={() => {
              console.log("confirm executed");
              setLoading(true);

              if (
                !productData?.productIds.length ||
                productData.totalNetW === 0
              ) {
                setRecord(null);
                setOpen(false);
                return setLoading(false);
              }

              fetch("/api/outbound/product/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productData, truckId }),
              })
                .then(async (res) => {
                  const data: { message: string } = await res.json();
                  console.log(res.status);
                  if (res.ok) {
                    alert(data.message);
                  } else {
                    console.log(data.message);
                    alert(data.message);
                  }
                  mutate("/api/trucks/find");
                })
                .catch((e: Error) => {
                  console.log(e);
                  alert(e);
                  mutate("/api/trucks/find");
                })

                .finally(() => {
                  mutate("/api/trucks/find");
                  setLoading(false);
                  setOpen(false);
                  setOpenRecordId("");
                });
            }}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}

interface ReportDamageFormProps {
  states: {
    record: TRecords | null;
    reportDamageForm: ReportDamageProduct;
    setReportDamageForm: React.Dispatch<
      React.SetStateAction<ReportDamageProduct>
    >;
    recordState: { open: boolean };
    setRecordState: React.Dispatch<React.SetStateAction<{ open: boolean }>>;
    truck: TTrucks;
  };
}

function ReportDamageForm({ states }: ReportDamageFormProps) {
  const { record, setRecordState, truck } = states;
  // if (!record) return <AiOutlineLoading size={20} className="animate-spin" />;
  const orderedProducts = record ? record?.orderedProducts : [];
  const [count, setCount] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState({
    name: "default",
    index: -1,
  });

  const [binProductIds, setBinProductIds] = useState<
    { blId: string; ids: string[] }[]
  >([]);

  const [selectedBinLocation, setSelectedBinLocation] =
    useState<TBinLocations>();
  const [quantity, setQuantity] = useState(0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const ids = binProductIds.flatMap((ap) => ap.ids);
        fetch("/api/outbound/damage-products/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids, SO: record?.SO, truckId: truck.id }),
        })
          .then((res) => res.json())
          .then((data: { message: string }) => {
            console.log(data);
            alert(data.message);
          })
          .finally(() => {
            mutate("/api/trucks/find");
            setRecordState({ open: false });
            setSelectedBinLocation(undefined);
            setBinProductIds([]);
          });
      }}
      className="inset-0 flex h-5/6 w-3/4 select-none flex-col gap-2 rounded-md bg-white/30 p-2 shadow-md backdrop-blur-sm "
    >
      {/* TITLE */}
      <div className="flex items-center justify-center border border-dashed border-black">
        <DamageFormTitle
          states={{
            setCount,
            setRecordState,
            setSelectedProduct,
            setBinProductIds,
            setSelectedBinLocation,
          }}
        />
      </div>
      {/* BODY */}

      <div className="flex h-2/3 flex-none flex-col gap-2 overflow-y-scroll border border-black p-2">
        {Array.isArray(orderedProducts) &&
          orderedProducts?.map((op) => {
            return (
              <div
                key={op.id}
                className="flex h-[20em] flex-none flex-col gap-2 overflow-y-scroll border border-black bg-slate-600 p-2"
              >
                <h1 className="sticky top-1 text-white">{op.productName}</h1>

                {op.binLocations.map((bl) => {
                  const goods = bl.assignedProducts.filter(
                    (ap) => ap.quality === "Good"
                  ).length;

                  const damages = bl.assignedProducts.filter(
                    (ap) => ap.quality === "Damage"
                  ).length;

                  return (
                    <div
                      className={`${
                        binProductIds.some((entry) => entry.blId === bl.id)
                          ? "bg-blue-500"
                          : "bg-white"
                      } flex h-12 w-full flex-none select-none items-center justify-center rounded-md p-[3px] shadow-md`}
                      key={bl.id}
                      onClick={() => {
                        setSelectedBinLocation(bl); // taking the binLocation to be extract
                        if (selectedBinLocation === bl) {
                          setSelectedBinLocation(undefined);
                        }
                        const blidIsIncluded = binProductIds.some(
                          (v) => v.blId === bl.id
                        );

                        setBinProductIds((ap) => {
                          return blidIsIncluded
                            ? binProductIds.filter((v) => v.blId !== bl.id)
                            : [...ap, { blId: bl.id, ids: [] }];
                        });
                      }}
                    >
                      {/* <h1>{bl.skuCode}</h1>
                      <h1>{bl.quantity}</h1> */}
                      <div className="flex h-full flex-grow items-center justify-center  rounded-l-md bg-green-600">
                        <h1 className="">Good: {goods}</h1>
                      </div>
                      <div className="flex h-full flex-grow items-center justify-center rounded-r-md bg-red-400">
                        <h1>Damaged: {damages}</h1>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      {/* FOOTING */}
      <div className="flex flex-col gap-2 p-2">
        <div className="sticky bottom-0">
          <Input
            attributes={{
              input: {
                type: "number",
                id: "quantity",
                min: 0,
                value: quantity,
                onChange: (e) => {
                  const newQuantity = Number(e.target.value);
                  // Ensure the quantity does not exceed the number of assigned products

                  if (selectedBinLocation) {
                    const maxQuantity = Math.min(
                      newQuantity,
                      selectedBinLocation?.assignedProducts.filter(
                        (ap) => ap.quality === "Good"
                      ).length
                    );
                    setQuantity(maxQuantity); // Set the quantity to the valid max
                  }
                },
              },
              label: { htmlFor: "quantity", children: "Quantity" },
            }}
          />
        </div>
        <Operators
          states={{
            setCount,
            count,
            orderedProducts,
            setSelectedProduct,
            setQuantity,
            selectedBinLocation,
            quantity,
            binProductIds,
            setBinProductIds,
          }}
        />
        <button className={buttonStyleSubmit}>Submit</button>
      </div>
    </form>
  );
}

interface OperatorsProps {
  states: {
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
    orderedProducts: TOrderedProductsWBinLocations[];
    setSelectedProduct: React.Dispatch<
      React.SetStateAction<{
        name: string;
        index: number;
      }>
    >;
    selectedBinLocation: TBinLocations | undefined;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    setBinProductIds: React.Dispatch<
      React.SetStateAction<{ blId: string; ids: string[] }[]>
    >;
    binProductIds: { blId: string; ids: string[] }[];
  };
}

function Operators({ states }: OperatorsProps) {
  const {
    setCount,
    count,
    orderedProducts,
    selectedBinLocation,
    quantity,
    binProductIds,
    setBinProductIds,

    setQuantity,
  } = states;

  return (
    <>
      <div className="flex  justify-between border border-black p-2">
        <div className="flex items-center justify-center">
          <FaPlus
            size={30}
            className="sticky bottom-0 right-0 shrink-0 hover:text-red-500 active:text-slate-900"
            type="button"
            onClick={() => {
              setCount((v) => Math.min(v + 1, orderedProducts.length ?? 0));

              const ids = selectedBinLocation?.assignedProducts

                .slice(0, quantity)
                .map((v) => v.id);
              console.log(ids);

              setBinProductIds((prev) => {
                // Ensure selectedBinLocation and its id are defined
                if (!selectedBinLocation || !selectedBinLocation.id)
                  return prev;

                const ids = selectedBinLocation.assignedProducts
                  .filter((ap) => ap.quality === "Good")
                  .slice(0, quantity)
                  .map((ap) => ap.id);

                // Check if there's already an entry for the selected bin location
                const existingEntry = prev.find(
                  (entry) => entry.blId === selectedBinLocation.id
                );

                if (existingEntry) {
                  // Filter out any ids that are already included
                  const newIds = ids.filter(
                    (id) => !existingEntry.ids.includes(id)
                  );

                  // Return updated state with new ids appended to the existing entry
                  return prev.map((entry) =>
                    entry.blId === selectedBinLocation.id
                      ? { ...entry, ids: [...entry.ids, ...newIds] } // Append new ids
                      : entry
                  );
                } else {
                  // If no entry exists, create a new one with the ids
                  return [
                    ...prev,
                    { blId: selectedBinLocation.id, ids }, // Add new entry
                  ];
                }
              });

              setQuantity(0);
            }}
          />
          <FaMinus
            size={30}
            className="sticky bottom-0 right-0 shrink-0 hover:text-red-500 active:text-slate-900"
            type="button"
            onClick={() => {
              setCount((v) => Math.max(v - 1, 0));
              // setSelectedProduct({ index: -1, name: "default" });
            }}
          />
        </div>
      </div>
      <div className="absolute -left-96 top-20 w-2/5 border border-black">
        {JSON.stringify(binProductIds, null, 2)}
      </div>
    </>
  );
}

interface DamageFormTitle {
  states: {
    setRecordState: React.Dispatch<SetStateAction<{ open: boolean }>>;
    setSelectedProduct: React.Dispatch<
      React.SetStateAction<{
        name: string;
        index: number;
      }>
    >;
    setCount: React.Dispatch<React.SetStateAction<number>>;
    setBinProductIds: React.Dispatch<
      React.SetStateAction<{ blId: string; ids: string[] }[]>
    >;

    setSelectedBinLocation: React.Dispatch<
      React.SetStateAction<TBinLocations | undefined>
    >;
  };
}

function DamageFormTitle({ states }: DamageFormTitle) {
  const {
    setCount,
    setRecordState,
    setSelectedProduct,
    setBinProductIds,
    setSelectedBinLocation,
  } = states;
  return (
    <>
      <RxCross2
        className="flex-shrink  hover:text-red-500"
        type="button"
        size={40}
        onClick={() => {
          setRecordState((v) => ({ ...v, open: false }));
          setSelectedProduct({ index: -1, name: "default" });
          setCount(0);
          setRecordState({ open: false });
          setSelectedBinLocation(undefined);
          setBinProductIds([]);
        }}
      />
      <h1 className="flex-grow  p-2 text-center font-black uppercase">
        send report and move into damage bin
      </h1>
    </>
  );
}
