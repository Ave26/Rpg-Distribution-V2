import {
  useState,
  type ChangeEvent,
  type FC,
  type SetStateAction,
} from "react";

interface ReusableInputProps {
  name?: string;
  type?: string;
  id?: string;
  value: any | undefined;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  onChange: (value: any) => void;
}

const ReusableInput: FC<ReusableInputProps> = ({
  name,
  id,
  type,
  value,
  placeholder,
  className,
  autoComplete,
  onChange,
}) => {
  const [initialStyle, setInitialStyle] = useState<string>(
    "w-full rounded-xl border border-gray-500 p-2 break-all"
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value.trim());
  };

  return (
    <div
      className={`flex w-full flex-col items-start justify-center gap-2 font-bold`}>
      <label htmlFor={name} className="w-full">
        {name}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={className ? className : initialStyle}
        onChange={handleInputChange}
      />
    </div>
  );
};
export default ReusableInput;
