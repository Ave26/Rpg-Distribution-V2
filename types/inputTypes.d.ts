type TFormData = {
  barcodeId: string;
  truck: string;
  destination: string;
  productName: string;
  clientName: string;
  quantity: number;
};

interface InputProps {
  inputValue: string | number | date;
  setInputValue: React.Dispatch<React.SetStateAction<TData>>;
  // setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

interface PersonalEffects {
  placeholder?: string;
  type?: string;
  min?: number;
}

export { InputProps, PersonalEffects, TFormData };
