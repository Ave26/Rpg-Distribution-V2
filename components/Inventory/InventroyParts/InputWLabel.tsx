import React, { useState } from "react";

type TInputWLabelProps = {
  inputAttributes: React.InputHTMLAttributes<HTMLInputElement>;
  lableAttributes?: React.LabelHTMLAttributes<HTMLLabelElement>;
  customInputStyle?: string; // Additional custom style for the input
  customLabelStyle?: string; // Additional custom style for the label
};

export default function InputWLabel({
  inputAttributes,
  lableAttributes,
  customInputStyle,
  customLabelStyle,
}: TInputWLabelProps) {
  return (
    <div className="relative flex h-fit w-fit gap-2 text-xs font-bold">
      <input
        {...inputAttributes}
        className={`peer appearance-none rounded-sm border border-black px-3 py-2 outline-none ${customInputStyle}`}
      />
      <label
        {...lableAttributes}
        className={`${
          typeof inputAttributes.value === "string" &&
          inputAttributes.value.length !== 0
            ? "-top-2 bg-white"
            : "top-2 bg-transparent"
        } absolute left-4 h-fit w-fit appearance-none uppercase transition-all ease-in ${customLabelStyle}`}>
        {lableAttributes?.children}
      </label>
    </div>
  );
}
