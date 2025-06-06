import React, { SetStateAction } from "react";
import { InputProps, PersonalEffects, TFormData } from "@/types/inputTypes";

interface InputFieldProps {
  personalEffects?: PersonalEffects;
  formData: TFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
  personalEffects,
  formData,
  handleChange,
}: InputFieldProps): JSX.Element {
  return (
    <div className="flex items-center justify-center">
      <label
        htmlFor="default-input"
        className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Default input
      </label>
      <input
        type="number"
        name="quantity"
        id="default-input"
        value={formData.quantity}
        onChange={handleChange}
        {...personalEffects}
        className="block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      />
    </div>
  );
}

export default InputField;
