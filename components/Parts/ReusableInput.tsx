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
  autoFocus?: boolean;
  min?: number;
  disableLabel?: boolean;
  onChange: (value: any) => void;
}

const ReusableInput: FC<ReusableInputProps> = ({
  name,
  id,
  type,
  value,
  placeholder,
  className,
  autoFocus,
  autoComplete,
  onChange,
  min,
  disableLabel,
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
      {disableLabel && (
        <label htmlFor={name} className="w-full">
          {name}
        </label>
      )}
      <input
        min={min}
        type={type}
        name={name}
        id={name}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={className ? className : initialStyle}
        onChange={handleInputChange}
      />
    </div>
  );
};
export default ReusableInput;
