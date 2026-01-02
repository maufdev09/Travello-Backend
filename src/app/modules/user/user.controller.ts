import { pick } from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userService } from "./user.service";

const ctreateGuideController = catchAsync(async (req, res) => {
  const result = await userService.ctreateGuideService(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Guide Created successfully!",
    data: result,
  });
});

const ctreateTouristController = catchAsync(async (req, res) => {
  const result = await userService.ctreateTouristService(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tourist Created successfully!",
    data: result,
  });
});
const ctreateAdminController = catchAsync(async (req, res) => {
  const result = await userService.ctreateAdmintService(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfully!",
    data: result,
  });
});

const getAllUserController = catchAsync(async (req, res) => {
  // page, limit, sortBy, sortOrder, fields,searchTerm
  const filters = pick(req.query, ["status", "role", "email", "searchTerm"]);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await userService.getAllUsersService(filters, options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Update Guide
const updateGuideController = catchAsync(async (req, res) => {
  const result = await userService.updateGuideService(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Guide updated successfully!",
    data: result,
  });
});

// Update Tourist
const updateTouristController = catchAsync(async (req, res) => {
  const result = await userService.updateTouristService(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tourist updated successfully!",
    data: result,
  });
});

// Update Admin
const updateAdminController = catchAsync(async (req, res) => {
  const result = await userService.updateAdminService(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated successfully!",
    data: result,
  });
});

const getUserByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.getUserByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully!",
    data: result,
  });
});

// Get all admins
const getAllAdminsController = catchAsync(async (req, res) => {
  const result = await userService.getAllAdminsService(req.query, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get all guides
const getAllGuidesController = catchAsync(async (req, res) => {
  const result = await userService.getAllGuidesService(req.query, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Guides fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get all tourists
const getAllTouristsController = catchAsync(async (req, res) => {
  const result = await userService.getAllTouristsService(req.query, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tourists fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// Get Tourist by ID
const getTouristByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.getTourisByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tourist fetched successfully!",
    data: result,
  });
});

// Get Guide by ID
const getGuideByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.getGuideByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Guide fetched successfully!",
    data: result,
  });
});

// Get Admin by ID
const getAdminByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.getAdminByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin fetched successfully!",
    data: result,
  });
});

// Delete Tourist
const deleteTouristByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteTouristByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tourist deleted successfully!",
    data: result,
  });
});

// Delete Guide
const deleteGuideByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteGuideByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Guide deleted successfully!",
    data: result,
  });
});

// Delete Admin
const deleteAdminByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteAdminByIdService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});

export const userController = {
  ctreateGuideController,
  ctreateTouristController,
  ctreateAdminController,
  getAllUserController,
  updateGuideController,
  updateTouristController,
  updateAdminController,
  getUserByIdController,
  getAllAdminsController,
  getAllGuidesController,
  getAllTouristsController,
  getTouristByIdController,
  getGuideByIdController,
  getAdminByIdController,
  deleteTouristByIdController,
  deleteGuideByIdController,
  deleteAdminByIdController,
};
