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

export const userController = {
  ctreateGuideController,
  ctreateTouristController,
  ctreateAdminController,
  getAllUserController,
};
