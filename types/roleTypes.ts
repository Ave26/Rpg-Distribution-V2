export type TRole = "Admin" | "Staff" | "Driver" | "SuperAdmin";
export type TEndPoints = {
  path: string;
  label: string;
};
export type TRoleToRoutes = {
  SuperAdmin: TEndPoints[];
  Admin: TEndPoints[];
  Staff?: TEndPoints[];
  Driver?: TEndPoints[];
};
