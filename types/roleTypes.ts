import { IconType } from "react-icons";

export type TRole = "ADMIN" | "STAFF" | "DRIVER" | "SUPERADMIN";

export type TEndPoints = {
  path: string;
  basePath?: string;
  label: string;
  subMenu?: {
    label: string;
    path: string;
    Icon: IconType;
  }[];

  Icon: IconType;
};

export type TRoleToRoutes = {
  SUPERADMIN: TEndPoints[];
  ADMIN: TEndPoints[];
  STAFF?: TEndPoints[];
  DRIVER?: TEndPoints[];
};
