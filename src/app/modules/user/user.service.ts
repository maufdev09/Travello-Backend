import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";

const ctreateGuideService = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    console.log(uploadResult);
    req.body.guide.profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const Result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.guide.email,
        password: hashedPassword,
        role: "GUIDE",
      },
    });

    return await tnx.guide.create({
      data: req.body.guide,
    });
  });

  return Result;
};

export const userService = {
  ctreateGuideService,
};
