import { users as TUser } from "@prisma/client";

// export type TAuth = Omit<TUser, "id" | "role" | "additionalInfo" | "orderId">;
export type TAuthNoPW = Omit<TUser, "password">;
export type TAuth = Pick<TUser, "password" | "username">; // should be umplemented 5-17-25

export type TUserResponse = {
  message: string;
  data: TAuthNoPW;
};

export type TOmitUser = Omit<TUser, "id" | "orderId">;
export type TUserWithConfirmPW = TOmitUser & {
  confirmPassword: string;
};
