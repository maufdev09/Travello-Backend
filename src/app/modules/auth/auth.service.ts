import { log } from "console";
import { UserStatus } from "../../../generated/prisma/client/enums";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { jwtHelper } from "../../helper/jwtHelper";
import { email } from "zod";

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
    throw new Error("Invalid credentials");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    "accessSecret Key",
    "1h"
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    "refreshSecret Key",
    "90d"
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
