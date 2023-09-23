interface AuthProps {
  authenticated?: boolean;
  verifiedToken?: VerifyToken;
}

interface VerifyToken {
  id?: string;
  roles?: string;
  iat?: number;
  exp?: number;
}

export { AuthProps, VerifyToken };
