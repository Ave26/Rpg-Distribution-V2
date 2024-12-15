import { UserRole } from "@prisma/client";

interface AuthProps {
  authenticated?: boolean;
  verifiedToken?: VerifyToken;
}

interface VerifyToken {
  id?: string;
  roles: UserRole;
  iat?: number;
  exp?: number;
}

export { AuthProps, VerifyToken };
