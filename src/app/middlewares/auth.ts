import jwt, { type JwtPayload } from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwtHelper";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new Error("you are not Authorized");
      }

      const verifyUser = jwtHelper.verifyUser(token,"abcd");
      req.user = verifyUser;
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new Error("you are not Authorized");
      }
        next();
    } catch (error) {
        next(error);
    }
  };
};

export default auth;