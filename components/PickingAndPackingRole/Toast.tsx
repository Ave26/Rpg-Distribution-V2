import React, { useEffect, useState } from "react";

type ToastPropsTypes = {
  states: TStates;
};

export type TToast = {
  door: boolean;
  message: string;
  animate: "animate-emerge" | "animate-fade" | "";
};

type TStates = {
  setToast: React.Dispatch<React.SetStateAction<TToast>>;
  toast: TToast;
};

export default function Toast({ states }: ToastPropsTypes) {
  const { setToast, toast } = states;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!toast.door) return;
    timer = setTimeout(() => {
      setToast({
        ...toast,
        door: false,
        message: toast.animate === "animate-fade" ? "" : "animate-fade",
      });
    }, 1200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.animate]);

  return (
    <>
      {toast.door && (
        <div
          className={`max-w-xs md:absolute md:bottom-32 md:left-14 ${toast.animate} text-center text-lg font-black uppercase text-red-500`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
