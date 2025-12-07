import { Result } from "./../../../generated/prisma/client/internal/prismaNamespace";
import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "../../../generated/prisma/client/enums";
import calculatePagination from "../../helper/paginationHelper";
import { Prisma } from "../../../generated/prisma/client/client";
import { userSearchableFields } from "./user.const";

const ctreateGuideService = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    console.log(uploadResult);
    req.body.data.profilePhoto = uploadResult?.secure_url;
  }

  let plainPassword = req.body.password.trim();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const Result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.data.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    return await tnx.guide.create({
      data: req.body.data,
    });
  });

  return Result;
};
const ctreateTouristService = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    console.log(uploadResult);
    req.body.data.profilePhoto = uploadResult?.secure_url;
  }

  let plainPassword = req.body.password.trim();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const Result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.data.email,
        password: hashedPassword,
        role: UserRole.TOURIST,
      },
    });

    return await tnx.tourist.create({
      data: req.body.data,
    });
  });

  return Result;
};

const ctreateAdmintService = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    console.log(uploadResult);
    req.body.data.profilePhoto = uploadResult?.secure_url;
  }

  let plainPassword = req.body.password.trim();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const Result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.data.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    return await tnx.admin.create({
      data: req.body.data,
    });
  });

  return Result;
};

const getAllUsersService = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

const total = await prisma.user.count({
    where: {
      AND: andConditions,
    },

   
  });

  return {

    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const userService = {
  ctreateGuideService,
  ctreateTouristService,
  ctreateAdmintService,
  getAllUsersService,
};
