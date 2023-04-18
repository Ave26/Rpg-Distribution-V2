interface AdditionalInfo {
  Dob: Date;
  Phone_number: number;
  email: string;
}

interface Data extends AdditionalInfo {
  message?: string;
  id: number;
  username: string;
  roles?: string[];
}

export { type AdditionalInfo, type Data };
