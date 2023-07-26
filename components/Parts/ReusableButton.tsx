import React from "react";
import Loading from "./Loading";
interface ReusableButtonProps {
  type?: any;
  name: string;
  style?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  name,
  onClick,
  type,
  isLoading,
  style,
}) => {
  return (
    <div className="w-full">
      <button
        type={type}
        onClick={onClick}
        className={`${
          style
            ? style
            : "flex w-full animate-emerge items-center justify-center rounded-md border border-black bg-transparent p-2 py-2 text-[6] transition-all hover:bg-sky-500 active:bg-transparent"
        }`}>
        {isLoading ? <Loading /> : name}
      </button>
    </div>
  );
};

export default ReusableButton;
