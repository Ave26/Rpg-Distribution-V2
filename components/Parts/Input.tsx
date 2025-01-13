import React from "react";

type TTMInputProps = {
  attributes: TAttributes;
  inputStyles?: string;
  labelStyles?: string;
};

type TAttributes = {
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  label?: React.LabelHTMLAttributes<HTMLLabelElement>;
};

export default function Input({
  attributes,
  inputStyles,
  labelStyles,
}: TTMInputProps) {
  const inputStyle =
    "placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border bg-transparent px-3 py-2.5 font-sans text-sm font-normal shadow-sm outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-sky-400 border-t-transparent focus:border-t-transparent focus:outline-0 disabled:border-0 placeholder:opacity-0 focus:placeholder:opacity-100";

  const labelStyle =
    "before:content[' '] after:content[' '] text-blue-gray-400 before:border-blue-gray-200 after:border-blue-gray-200 peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] text-xs font-bold uppercase leading-tight transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-sky-400 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:border-sky-400 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:border-sky-400 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent";

  return (
    <div className="relative h-full w-full">
      <input {...attributes.input} className={`${inputStyle} ${inputStyles}`} />
      <label {...attributes.label} className={`${labelStyle} ${labelStyles}`} />
    </div>
  );
}
