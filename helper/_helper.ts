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

  return { date };
};

export const getId = (verifiedToken: string | JwtPayload | undefined) => {
  let userId: string = "";
  if (verifiedToken && typeof verifiedToken === "object") {
    userId = verifiedToken.id;
  }

  return { userId };
};
