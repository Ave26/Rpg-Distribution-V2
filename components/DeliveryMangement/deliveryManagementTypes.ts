import { trucks } from "@prisma/client";

export type TSelectedBTN = "Truck Management" | "View Truck Loads";
export type TForm = Omit<
  trucks,
  "id" | "status" | "driverId" | "routeClusterId"
>;
export type TFormExtend = TForm & {
  id: string;
  status: string;
};
