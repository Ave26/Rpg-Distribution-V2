import React, { useState } from "react";

interface OperationalToggleProps {
  isManual: boolean;
  setIsManual: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OperationalToggle({
  isManual,
  setIsManual,
}: OperationalToggleProps) {
  return (
    <label className="relative flex h-full w-fit cursor-pointer items-center justify-start">
      <input
        type="checkbox"
        className="peer sr-only"
        onClick={() => setIsManual(!isManual)}
      />
      <div
        className="relative flex h-5 w-5 items-center justify-center text-center font-bold before:absolute before:-top-3 before:w-20 before:animate-fade before:text-[.6em] before:font-thin after:absolute after:flex after:h-9 after:w-9 after:items-center after:justify-center after:rounded-full after:text-center after:transition-all after:content-['A'] peer-checked:after:rotate-[360deg] peer-checked:after:content-['M']
        "
      ></div>
    </label>
  );
}
