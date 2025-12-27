import httpStatus from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { jwtHelper } from "../helper/jwtHelper";
import ApiError from "../errors/ApiError";
import config from "../../config";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "you are not Authorized");
      }

      const verifyUser = jwtHelper.verifyUser(token, config.jwt.secret as Secret) as JwtPayload;
      req.user = verifyUser;
      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "you are not Authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
