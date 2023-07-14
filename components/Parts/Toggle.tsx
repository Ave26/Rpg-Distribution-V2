import React from "react";

interface Toggle {
  isToggle: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Toggle({ isToggle, setIsToggle }: Toggle): JSX.Element {
  return (
    <div className="flex w-full items-center justify-start">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          value=""
          className="peer sr-only"
          onClick={() => {
            setIsToggle((prevToggle: boolean) => !prevToggle);
          }}
        />
        <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-green-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {isToggle ? "Damage" : "Good"}
        </span>
      </label>
    </div>
  );
}
