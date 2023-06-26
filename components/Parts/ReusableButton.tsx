import React from "react";

interface ReusableButtonProps {
  name: string;
  onClick: () => void;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({ name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full animate-emerge rounded-md border border-black bg-transparent py-2 text-[6] transition-all hover:bg-sky-500 active:bg-transparent`}>
      {name}
    </button>
  );
};

export default ReusableButton;
