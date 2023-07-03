import React from "react";
import Loading from "./Loading";
interface ReusableButtonProps {
  type?: any;
  name: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  name,
  onClick,
  type,
  isLoading,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex w-full animate-emerge items-center justify-center rounded-md border border-black bg-transparent p-2 py-2 text-[6] transition-all hover:bg-sky-500 active:bg-transparent`}>
      {isLoading ? <Loading /> : name}
    </button>
  );
};

export default ReusableButton;
