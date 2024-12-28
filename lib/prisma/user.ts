import { JwtPayload } from "jsonwebtoken";
import prisma from "./index";
import { UsersAdditionalInfo } from "@prisma/client";

export const createUser = async (
  username: string,
  password: string,
  role: string,
  additionalInfo: UsersAdditionalInfo
) => {
  try {
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: password,
        roles: { connect: { role } },
        additionalInfo,
      },
      select: {
        id: true,
        username: true,
        role: true,
        additionalInfo: true,
      },
    });
    return { newUser };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const findUser = async (username: string) => {
  try {
    const user = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    // await prisma.users.update({
    //   where: { id: user?.id },
    //   data: { roles: { connect: { role: "ADMIN" } } },
    // });

    return { user };
  } catch (error) {
    return { error };
  }
};

export const findUserFilterPassword = async (username: string) => {
  try {
    const filteredUser = await prisma.users.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        roles: true,
      },
    });
    return { filteredUser };
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
        additionalInfo: true,
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
