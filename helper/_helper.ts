import { JwtPayload } from "jsonwebtoken";

export const setTime = () => {
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

export const getId = (verifiedToken: string | JwtPayload | undefined) => {
  let userId: string = "";
  if (verifiedToken && typeof verifiedToken === "object") {
    userId = verifiedToken.id;
  }

  return { userId };
};
