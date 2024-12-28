import bcrypt from "bcrypt";

export const comparePassword = async (plainPwd: string, hashedPwd: string) => {
  const verifiedPwd = await bcrypt.compare(plainPwd, hashedPwd);
  return verifiedPwd;
};

export const hashPassword = async (password: string, salt: number) => {
  return await bcrypt.hash(password, salt);
};
