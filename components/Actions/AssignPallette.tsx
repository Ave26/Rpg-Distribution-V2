// import React from "react";

// interface PalletteProps {
//   setIslocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export default function AssignPallette({ setIsLocationOpen }: PalletteProps) {
//   return (
//     <div className="bg-opacity-50 bg-sky-300 absolute inset-0 md:p-[10rem] md:px-96 w-full h-full">
//       <div className="bg-black h-full w-full">AssignPallette</div>
//     </div>
//   );
// }

import React from "react";

interface PalletteProps {
  isLocationOpen: boolean;
  setIsLocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AssignPallette({
  isLocationOpen,
  setIsLocationOpen,
}: PalletteProps) {
  const handleClick = () => {
    setIsLocationOpen(false);
  };

  const handleChildClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("Child Clicked!");
  };

  return (
    <div
      className={`${
        !isLocationOpen && "animate-fade"
      } bg-opacity-50 bg-sky-300 absolute inset-0 md:p-[10rem] md:px-96 w-full h-full`}
      onClick={handleClick}
      onAnimationEnd={() => {
        setIsLocationOpen(false);
      }}
    >
      <div className="bg-sky-900 h-full w-full" onClick={handleChildClick}>
        AssignPallette
      </div>
    </div>
  );
}

// --> click -> true -> animate -> null
