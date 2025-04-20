import { UserRole } from "@prisma/client";

export interface AuthProps {
  authenticated?: boolean;
  verifiedToken?: VerifyToken;
}

interface VerifyToken {
  id?: string;
  role: string;
  iat?: number;
  exp?: number;
}

export { AuthProps, VerifyToken };
