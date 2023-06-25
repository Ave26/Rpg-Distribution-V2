import type { ChangeEvent, FC, SetStateAction } from "react";

interface ReusableInputProps {
  name?: string;
  type?: string;
  value: any;
  placeholder?: string;
  onChange: (value: string) => void;
}

const ReusableInput: FC<ReusableInputProps> = ({
  name,
  type,
  value,
  placeholder,
  onChange,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex max-w-full flex-col items-start justify-center gap-2 p-2 font-bold">
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        className="max-w-full border border-black p-2"
        onChange={handleInputChange}
      />
    </div>
  );
};
export default ReusableInput;
