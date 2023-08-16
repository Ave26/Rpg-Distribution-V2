interface InputProps {
  inputValue: string | number;
  setInputValue: React.Dispatch<React.SetStateAction<anyr>>;
}

interface PersonalEffects {
  placeholder?: string;
  type?: string;
  min?: number;
}

export { InputProps, PersonalEffects };
