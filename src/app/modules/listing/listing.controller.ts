import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { listingService } from "./listing.service";

const ctreateListingController = catchAsync(async (req, res) => {
  const result = await listingService.createListing(req)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfully!",
    data: {},
  });

})


  export const  lstingController = {
    ctreateListingController
    
  }


