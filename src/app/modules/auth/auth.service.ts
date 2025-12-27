import  httpStatus  from 'http-status';
import { UserStatus } from "../../../generated/prisma/client/enums";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";

import { jwtHelper } from "../../helper/jwtHelper";
import ApiError from "../../errors/ApiError";
import config from '../../../config';

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const authService = {
  login,
};
