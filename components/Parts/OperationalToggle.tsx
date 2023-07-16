import React, { useState } from "react";

interface Operation {
  isManual: boolean;
  setIsManual: React.Dispatch<React.SetStateAction<boolean>>;
}

function OperationalToggle({ isManual, setIsManual }: Operation): JSX.Element {
  console.log(isManual);
  return (
    <div className="relative flex w-full flex-row-reverse items-center justify-start ">
      <label className="relative flex h-full w-fit cursor-pointer items-center justify-start gap-2 p-2">
        <input
          type="checkbox"
          className="peer sr-only"
          onClick={() => {
            setIsManual(!isManual);
          }}
        />
        <div
          className="relative flex h-10 w-10 items-center justify-center text-center font-bold before:absolute before:-top-3 before:w-20 before:animate-fade before:text-[.6em] before:font-thin after:absolute after:flex after:h-9 after:w-9 after:items-center after:justify-center after:rounded-full after:border after:border-black after:text-center after:transition-all after:content-['A'] peer-checked:after:rotate-[360deg] peer-checked:after:content-['M']
        hover:before:animate-emerge hover:before:content-['SWITCH']"></div>
      </label>
      <div className={`relative flex w-[81px] items-center justify-center`}>
        <p
          className={`absolute transition-all  ${
            isManual ? "animate-emerge" : "animate-fade"
          } `}>
          Manual
        </p>
        <p
          className={`absolute transition-all ${
            !isManual ? "animate-emerge" : "animate-fade"
          } `}>
          Automatic
        </p>
      </div>
    </div>
  );
}

export default OperationalToggle;
