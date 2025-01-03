import { IconType } from "react-icons";

export type TRole = "ADMIN" | "STAFF" | "DRIVER" | "SUPERADMIN";

export type TEndPoints = {
  path: string;
  label: string;
  Icon: IconType;
};

export type TRoleToRoutes = {
  SUPERADMIN: TEndPoints[];
  ADMIN: TEndPoints[];
  STAFF?: TEndPoints[];
  DRIVER?: TEndPoints[];
};
