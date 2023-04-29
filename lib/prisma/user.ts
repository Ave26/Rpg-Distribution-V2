import prisma from "./index";

type AdditionalInfo = {
  Dob: string;
  Phone_Number: number;
  email: string;
};

export const createUser = async (
  username: string,
  password: string,
  AdditionalInfo: AdditionalInfo
) => {
  try {
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: password,
        roles: "staff",
        additional_Info: AdditionalInfo,
      },
      select: {
        id: true,
        username: true,
        roles: true,
        additional_Info: true,
      },
    });
    return { newUser };
  } catch (error) {
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
    console.log(user);
    return { user };
  } catch (error) {
    return { error };
  }
};

export const findUserBasedOnId = async (id: string) => {
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
