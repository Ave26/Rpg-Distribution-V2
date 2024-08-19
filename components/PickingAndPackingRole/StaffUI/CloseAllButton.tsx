import React from "react";

type TCloseAllButtonProps = {
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
};

function CloseAllButton({ setSelectedId }: TCloseAllButtonProps) {
  return (
    <button
      className={`sticky w-full rounded-lg bg-blue-700/30 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700   dark:bg-blue-600/70 dark:hover:bg-blue-700  dark:active:bg-blue-900/70 sm:w-auto`}
      onClick={() => setSelectedId("")}
    >
      Close All
    </button>
  );
}

export default CloseAllButton;
