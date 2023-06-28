import {
  useState,
  type ChangeEvent,
  type FC,
  type SetStateAction,
} from "react";

interface ReusableInputProps {
  name?: string;
  type?: string;
  value: any;
  placeholder?: string;
  className?: string;
  onChange: (value: any) => void;
}

const ReusableInput: FC<ReusableInputProps> = ({
  name,
  type,
  value,
  placeholder,
  className,
  onChange,
}) => {
  const [initialStyle, setInitialStyle] = useState<string>(
    "border border-black p-2"
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div
      className={`flex max-w-full flex-col items-start justify-center gap-2 p-2 font-bold`}>
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        className={className ? className : initialStyle}
        onChange={handleInputChange}
      />
    </div>
  );
};
export default ReusableInput;
