import Loading from "@/components/Parts/Loading";
import React, { useEffect, useState } from "react";
import { TSKU, TToast } from "../InventoryTypes";
import { stockKeepingUnit } from "@prisma/client";
import Toast from "@/components/Parts/Toast";

type InventoryRequestButtonProps = {
  states: TStates;
};

type TStates = {
  loading: {
    product: boolean;
    sku: {
      update: boolean;
      alter: boolean;
    };
  };
  setLoading: React.Dispatch<
    React.SetStateAction<{
      product: boolean;
      sku: {
        update: boolean;
        alter: boolean;
      };
    }>
  >;
  SKU: TSKU;
  setSKU: React.Dispatch<React.SetStateAction<TSKU>>;
  toast: TToast;
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  mutate: () => void;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
};

type TData = {
  message: string;
  updatedSKU: stockKeepingUnit;
  SKUCreated: stockKeepingUnit;
};

function InventoryRequestButton({ states }: InventoryRequestButtonProps) {
  const [skuReq, setSKUReq] = useState<"alter" | "add" | "default">("default");
  const [swapBtn, setSwapBtn] = useState(false);

  function alter() {
    fetch("/api/inventory/sku/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SKU: states.SKU,
      }),
    })
      .then((res) => res.json())
      .then(({ updatedSKU, message }: TData) => {
        states.setToast((prevState: TToast) => ({
          ...prevState,
          message,
          show: true,
        }));
        updatedSKU && states.mutate();
      })
      .catch((error) => error)
      .finally(() => {
        setSwapBtn(false);
        setSKUReq("default");
        states.setSKU((prevState) => ({
          ...prevState,
          threshold: 0,
          weight: 0,
        }));
      });
  }

  function add() {
    console.log("add");
    fetch("/api/inventory/sku/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SKU: states.SKU,
        code: states.code,
      }),
    })
      .then((res) => res.json())
      .then(({ message, SKUCreated }: TData) => {
        states.setToast((prevState: TToast) => ({
          ...prevState,
          message,
          show: true,
        }));
        SKUCreated && states.mutate();
      })
      .catch((error) => error)
      .finally(() => {
        setSwapBtn(false);
        setSKUReq("default");
        states.setSKU((prevState) => ({
          ...prevState,
          threshold: 0,
          weight: 0,
        }));
        states.setCode("");
      });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      states.setToast((prevState) => ({ ...prevState, show: false }));
    }, 1200);

    return () => clearTimeout(timer);
  }, [states.toast.show]);

  useEffect(() => {
    console.log(states.disabled);
  }, [states.disabled]);

  const btnStyle = `rounded-sm bg-sky-300/40 p-2 h-[40px] w-full shadow-md hover:bg-sky-300/80 active:bg-sky-300 uppercase text-xs font-bold w-full`;
  return (
    <div className="flex flex-row gap-2">
      {!swapBtn ? (
        <>
          <button
            className={`${btnStyle}`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSKUReq("alter");
              setSwapBtn(true);
            }}>
            Alter
          </button>
          <button
            disabled={!states.disabled}
            className={`${btnStyle} ${
              states.disabled ? "opacity-100" : "opacity-0"
            }`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSKUReq("add");
              setSwapBtn(true);
            }}>
            Add
          </button>
        </>
      ) : (
        <>
          <button
            className={btnStyle}
            onClick={() => {
              setSwapBtn(false);
              setSKUReq("default");
            }}>
            Cancel
          </button>
          <button
            className={btnStyle}
            onClick={(e) => {
              e.preventDefault();
              const btnRoutes: Record<string, () => void> = {
                alter: alter,
                add: add,
              };
              const selectedBtn = btnRoutes[skuReq];
              return selectedBtn();
            }}>
            Confirm
          </button>
        </>
      )}
    </div>
  );
}

export default InventoryRequestButton;
