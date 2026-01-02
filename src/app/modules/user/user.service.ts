import httpStatus from "http-status";
import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "../../../generated/prisma/client/enums";
import calculatePagination from "../../helper/paginationHelper";
import { Prisma } from "../../../generated/prisma/client/client";
import {
  adminSearchableFields,
  guideSearchableFields,
  touristSearchableFields,
  userSearchableFields,
} from "./user.const";
import ApiError from "../../errors/ApiError";

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
        role: UserRole.GUIDE,
      },
    });

    return await tnx.guide.create({
      data: req.body.data,
    });
  });

  return Result;
};

const updateGuideService = async (req: Request) => {
  const guideId = req.params.id;

  if (!guideId) {
    throw new Error("Guide ID is required");
  }

  // Handle profile photo update
  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    req.body.data.profilePhoto = uploadResult?.secure_url;
  }

  // Ensure guide exists
  const existingGuide = await prisma.guide.findUnique({
    where: { id: guideId },
  });

  if (!existingGuide) {
    throw new ApiError(httpStatus.NOT_FOUND, "Guide not found");
  }

  // Update ONLY guide data
  const updatedGuide = await prisma.guide.update({
    where: { id: guideId },
    data: req.body.data,
  });

  return updatedGuide;
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

const updateTouristService = async (req: Request) => {
  const touristId = req.params.id;

  if (!touristId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tourist ID is required");
  }

  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    req.body.data.profilePhoto = uploadResult?.secure_url;
  }

  const existingTourist = await prisma.tourist.findUnique({
    where: { id: touristId },
  });

  if (!existingTourist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tourist not found");
  }

  return await prisma.tourist.update({
    where: { id: touristId },
    data: req.body.data,
  });
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

const updateAdminService = async (req: Request) => {
  const adminId = req.params.id;

  if (!adminId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is required");
  }

  if (req.file) {
    const uploadResult = await fileUploader.uloadToCloudinary(req.file);
    req.body.data.profilePhoto = uploadResult?.secure_url;
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!existingAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return await prisma.admin.update({
    where: { id: adminId },
    data: req.body.data,
  });
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

const getUserByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      admin: true,
      guide: true,
      tourist: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};



const getAllGuidesService = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.GuideWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: guideSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
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

  const result = await prisma.guide.findMany({
    skip,
    take: limit,
    where: {
      AND: andConditions,
      isDeleted: false,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.guide.count({
    where: {
      AND: andConditions,
      isDeleted: false,
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

const getAllTouristsService = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.TouristWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: touristSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
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

  const result = await prisma.tourist.findMany({
    skip,
    take: limit,
    where: {
      AND: andConditions,
      isDeleted: false,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.tourist.count({
    where: {
      AND: andConditions,
      isDeleted: false,
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

const getAllAdminsService = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
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

  const result = await prisma.admin.findMany({
    skip,
    take: limit,
    where: {
      AND: andConditions,
      isDeleted: false,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: {
      AND: andConditions,
      isDeleted: false,
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

const getTourisByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tourist ID is required");
  }

  const tourist = await prisma.tourist.findUnique({
    where: { id },
  });

  if (!tourist || tourist.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tourist not found");
  }

  return tourist;
};

const getAdminByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is required");
  }

  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin || admin.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return admin;
};



const getGuideByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Guide ID is required");
  }

  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      availabilities: true,
      listings: true,
    },
  });

  if (!guide || guide.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Guide not found");
  }

  return guide;
};


// ================= DELETE TOURIST =================
const deleteTouristByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tourist ID is required");
  }

  const tourist = await prisma.tourist.findUnique({ where: { id } });

  if (!tourist || tourist.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Tourist not found");
  }

  return await prisma.tourist.update({
    where: { id },
    data: { isDeleted: true },
  });
};

// ================= DELETE GUIDE =================
const deleteGuideByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Guide ID is required");
  }

  const guide = await prisma.guide.findUnique({ where: { id } });

  if (!guide || guide.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Guide not found");
  }

  return await prisma.guide.update({
    where: { id },
    data: { isDeleted: true },
  });
};

// ================= DELETE ADMIN =================
const deleteAdminByIdService = async (id: string) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin ID is required");
  }

  const admin = await prisma.admin.findUnique({ where: { id } });

  if (!admin || admin.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return await prisma.admin.update({
    where: { id },
    data: { isDeleted: true },
  });
};


export const userService = {
  ctreateGuideService,
  ctreateTouristService,
  ctreateAdmintService,
  getAllUsersService,
  updateGuideService,
  updateTouristService,
  updateAdminService,
  getUserByIdService,
  getAllTouristsService,
  getAllGuidesService,
  getAllAdminsService,
  getTourisByIdService,
  getAdminByIdService,
  getGuideByIdService,
  deleteTouristByIdService,
  deleteGuideByIdService,
  deleteAdminByIdService
};
