import React from "react";

interface PalletteProps {
  setIslocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// { setIsLocationOpen }: PalletteProps

export default function AssignPallette() {
  return (
    <div className="w-1/2 h-1/2 bg-green-500 absolute" onMouseLeave={() => {}}>
      AssignPallette
    </div>
  );
}
