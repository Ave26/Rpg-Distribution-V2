// authMiddleware.ts
import { verifyJwt } from "@/lib/helper/jwt";
import { VerifyToken } from "@/types/authTypes";
import { JwtPayload } from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export interface UserToken {
  id: string;
  roles: string;
}

export const authMiddleware =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      verifiedToken: JwtPayload & UserToken
    ) => Promise<NextApiResponse | void> // swap into type void
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error } = await verifyJwt(req);

      if (error) {
        return res.status(403).json({
          authenticated: false,
          message: error,
        });
      }

      if (verifiedToken) {
        return handler(req, res, verifiedToken);
      }
    } catch (error) {
      return res.send(error);
    }
  };

/* CAN BE REFACTOR INTO THIS FOR IMPLEMENTING AUTHORIZATION
    // authMiddleware.ts
import { verifyJwt } from "@/lib/helper/jwt";
import { JwtPayload } from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const authMiddleware = (requiredRole: string) =>
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      verifiedToken: string | JwtPayload | undefined
    ) => Promise<void>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { verifiedToken, error } = await verifyJwt(req);

      if (error) {
        return res.status(403).json({
          authenticated: false,
          message: error,
        });
      }

      if (verifiedToken && verifiedToken.role === requiredRole) {
        return handler(req, res, verifiedToken);
      } else {
        return res.status(403).json({
          authenticated: true,
          authorized: false,
          message: "Unauthorized",
        });
      }
    } catch (error) {
      return res.send(error);
    }
  };

  
  */
