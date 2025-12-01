import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";

const ctreateGuideService = async (req: Request) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const Result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
        role: "GUIDE",
      },
    });

    return await tnx.guide.create({
      data: {
        email: req.body.email,
        name: req.body.name,
      },
    });
  });

  return Result;
};

export const userService = {
  ctreateGuideService,
};
