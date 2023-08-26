type UsersAdditionalInfo = {
  Dob: string;
  Phone_Number: number;
  email: string;
};

type User = {
  id: string;
  additional_Info: UsersAdditionalInfo;
  password: string;
  roles: string;
  username: string;
  assignment: Assignment[];
};

export { User };
