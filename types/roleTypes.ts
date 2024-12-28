export type TRole = "ADMIN" | "STAFF" | "DRIVER" | "SUPERADMIN";

export type TEndPoints = {
  path: string;
  label: string;
};
export type TRoleToRoutes = {
  SUPERADMIN: TEndPoints[];
  ADMIN: TEndPoints[];
  STAFF?: TEndPoints[];
  DRIVER?: TEndPoints[];
};
