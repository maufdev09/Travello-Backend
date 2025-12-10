import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { bookingService } from "./bokking.service";

const ctreateBookingController = catchAsync(async (req, res) => {

  const result = await bookingService.createBooking(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Created successfully!",
    data: result,
  });
});

export const bookingController = {
  ctreateBookingController
};
