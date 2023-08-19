interface AuthProps {
  authenticated?: boolean;
  verifiedToken?: {
    id?: string;
    roles?: string;
    iat?: number;
    exp?: number;
  };
}

export { AuthProps };
