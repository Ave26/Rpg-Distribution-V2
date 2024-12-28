import { users as TUser } from "@prisma/client";

export type TAuth = Omit<TUser, "id" | "role" | "additionalInfo">;
export type TAuthNoPW = Omit<TUser, "password">;

export type TUserResponse = {
  message: string;
  data: TAuthNoPW;
};

export type TOmitUser = Omit<TUser, "id">;
export type TUserWithConfirmPW = TOmitUser & {
  confirmPassword: string;
};
