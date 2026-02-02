import  httpStatus  from 'http-status';
import { Result } from './../../../generated/prisma/client/internal/prismaNamespace';
import { pick } from "../../helper/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { listingService } from "./listing.service";
import { JwtPayload } from 'jsonwebtoken';

const ctreateListingController = catchAsync(async (req, res) => {
  const result = await listingService.createListing(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Listing created successfully!",
    data: result,
  });
});

const getAllListingController = catchAsync(async (req, res) => {

   const decodedToken = req?.user as JwtPayload
  // page, limit, sortBy, sortOrder, fields,searchTerm
  const filters = pick(req.query, [
    "title",
    "city",
    "category",
    "guideId",
    "maxGroupSize",
    "searchTerm",
    "searchTerm",
  ]);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await listingService.getAllListingsService(filters, options,decodedToken);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Listing retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});


const getlistingSuggestion = catchAsync(async (req, res) => {
  const result= await listingService.getlistingSuggestion(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing suggestions retrieved successfully!",
    data: result,
  });


})
const deleteListingController = catchAsync(async (req, res) => {
  const { id } = req.params;

  await listingService.deleteListing(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing deleted successfully!",
    data: null,
  });
});

const getAllListingsPublicController = catchAsync(async (req, res) => {
  // page, limit, sortBy, sortOrder, fields,searchTerm
  const filters = pick(req.query, [
    "title",
    "city",
    "category",
    "guideId",
    "maxGroupSize",
    "searchTerm",
  ]);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await listingService.getAllListingsPublic(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listings retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getListingByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await listingService.getListingById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Listing retrieved successfully!",
    data: result,
  });
});


export const lstingController = {
  ctreateListingController,
  getAllListingController,
  getlistingSuggestion,
  deleteListingController,
  getAllListingsPublicController,
  getListingByIdController
};
