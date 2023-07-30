import { JwtPayload } from "jsonwebtoken";
import prisma from "./index";

type AdditionalInfo = {
  Dob: string;
  Phone_Number: number;
  email: string;
};

export const createUser = async (
  username: string,
  password: string,
  additional_Info: AdditionalInfo
) => {
  // const { Dob, Phone_Number, email } = additional_Info;
  if (additional_Info) {
    console.log(additional_Info);
    console.log("user.ts");
  }
  try {
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: password,
        roles: "staff",
        additional_Info,
      },
      select: {
        id: true,
        username: true,
        roles: true,
        additional_Info: true,
      },
    });
    // console.log(newUser + " user.ts");
    return { newUser };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const findUser = async (username: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });
    return { user };
  } catch (error) {
    return { error };
  }
};

export const findUserBasedOnId = async (id: string | undefined) => {
  try {
    // Check if user already exists
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        roles: true,
        additional_Info: true,
      },
    });
    return { user };
  } catch (error) {
    return { error };
  }
};

export const findAllUsers = async () => {
  const users = await prisma.users.findMany({});
  try {
    return { users };
  } catch (error) {
    return { error };
  }
};
