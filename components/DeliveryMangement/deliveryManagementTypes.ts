import { trucks } from "@prisma/client";
import { TruckAvailability } from "@prisma/client";

export type TSelectedBTN =
  | "Truck Management"
  | "View Truck Loads"
  | "Manage Location"
  | "Empty";

export type TForm = Pick<trucks, "truckName" | "plate" | "payloadCapacity">;
export type TFormExtend = TForm & {
  status: TruckAvailability;
};

export type TSelectedTruck = {
  id: string;
  truckName: string;
  truckStatus: TruckAvailability;
};
