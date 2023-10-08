export type TCoordinates = {
  latitude: number;
  longitude: number;
};

export type TLocationEntry = TCoordinates & {
  timestamp: Date;
  message: string;
};

export type TDeliveryTrigger = {
  name: "Start Delivery" | "Stop Delivery";
  hasStart: boolean;
};
