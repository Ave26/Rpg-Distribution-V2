export type TRole = "Admin" | "staff";
export type TEndPoints = {
  path: string;
  label: string;
};
export type TRoleToRoutes = {
  Admin: TEndPoints[];
  staff: TEndPoints[];
  Driver: TEndPoints[];
};
