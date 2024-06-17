import { locations, Coordinates } from "@prisma/client";

export type TOmitLocation = Omit<
  locations,
  "id" | "recordId" | "deliveryLogsId"
>;
