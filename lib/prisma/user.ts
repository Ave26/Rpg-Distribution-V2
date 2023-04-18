import prisma from "./index";

type AdditionaInfo = {
  Dob: string;
  Phone_Number: number;
  email: string;
};

export const createUser = async (
  username: string,
  password: string,
  roles: string[],
  { Dob, Phone_Number, email }: AdditionaInfo
) => {
  try {
    let defaultRole = ["user"];
    const newUser = await prisma.users.create({
      data: {
        username: username,
        password: password,
        roles: defaultRole,
        additional_Info: {
          Dob: Dob,
          Phone_Number: Phone_Number,
          email: email,
        },
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
