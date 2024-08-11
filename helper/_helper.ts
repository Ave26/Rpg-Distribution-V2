import { TBinLocation } from "@/components/PickingAndPackingRole/AdminUI/Admin";
import { TToast } from "@/components/PickingAndPackingRole/Toast";
import { TAssignedProducts } from "@/pages/api/inbound/scan";
import { JwtPayload } from "jsonwebtoken";

export const setTime = (initialDate?: Date) => {
  let date = new Date();

  // Set the time component to zero
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  // Format the date without time zone offset in local time
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
  const day = date.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  const newDate = formattedDate.toString().split("T")[0];

  return { date, newDate };
};

export const convertTime = (expiry: Date | null) => {
  let DateReceive = new Date();

  // Set the time component to zero
  DateReceive.setUTCHours(0);
  DateReceive.setUTCMinutes(0);
  DateReceive.setUTCSeconds(0);
  DateReceive.setUTCMilliseconds(0);

  // Format the date without time zone offset in local time
  DateReceive.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const DateExpiry = `${expiry}T00:00:00.000Z`;
  const receive = `${DateReceive}T00:00:00.000Z`;
  console.log(DateExpiry);
  return { DateExpiry, DateReceive, receive };
};

export const getId = (verifiedToken: string | JwtPayload | undefined) => {
  let userId: string = "";
  if (verifiedToken && typeof verifiedToken === "object") {
    userId = verifiedToken.id;
  }

  return { userId };
};

export function checkError(
  binLocation: TBinLocation,
  setToast: React.Dispatch<React.SetStateAction<TToast>>
) {
  const searchSKU = binLocation.searchSKU;
  const totalQuantity = binLocation.totalQuantity;

  if (!searchSKU && !totalQuantity) {
    setToast({
      animate: "animate-emerge",
      door: true,
      message: "Empty Filled for searchSKU and quantity",
    });
  } else if (!totalQuantity) {
    setToast({
      animate: "animate-emerge",
      door: true,
      message: "Empty Filled for quantity",
    });
  } else if (!searchSKU) {
    setToast({
      animate: "animate-emerge",
      door: true,
      message: "Empty Filled for searchSKU",
    });
  }
}
