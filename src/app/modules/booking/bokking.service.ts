import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "../../../generated/prisma/client/enums";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";

const createBooking = async (payload: any) => {

if (!payload.bookingDateId) {
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    "bookingDateId is required to create a booking."
  );
}


  const result = await prisma.$transaction(async (tnx) => {
    const existingBooking = await tnx.booking.findUnique({
      where: {
        bookingDateId: payload.bookingDateId,
      },
    });

    if (existingBooking) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "This availability slot is already booked."
      );
    }

    const bookingData = await tnx.booking.create({
      data: {
        guests: payload.guests,
        totalPrice: payload.totalPrice,
        currency: payload.currency,
        listing: { connect: { id: payload.listingId } },
        tourist: { connect: { id: payload.touristId } },
        guide: { connect: { id: payload.guideId } },
        bookingDate: { connect: { id: payload.bookingDateId } },
      },
      include: {
        tourist: true, // 👈 Populate tourist
        guide: true, // optional
        listing: true, // optional
        bookingDate: true, // optional
      },
    });

    // await tnx.availability.update({
    //   where: { id: bookingData.bookingDateId },
    //   data: {
    //     booked: true,
    //   },
    // });

    const transactionId = uuidv4();

    await tnx.payment.create({
      data: {
        amount: payload.totalPrice,
        currency: payload.currency,
        status: PaymentStatus.PENDING,
        booking: { connect: { id: bookingData.id } },
        transactionId: transactionId,
      },
    });

    const sslPayload: ISSLCommerz = {
      email: bookingData.tourist?.email || "",
      phoneNumber: bookingData?.tourist?.contactNumber || "",
      name: bookingData.tourist?.name || "",
      amount: bookingData.totalPrice,
      transactionId: transactionId,
      bookingDateId: payload.bookingDateId,
    };

    console.log("sslPayload", sslPayload);
    

    const sslResponse = await sslCommerzService.sslPaymentInit(sslPayload);

    return {
      payment: sslResponse.GatewayPageURL,
      booking: bookingData,
    };
  });

  return result;
};

export const bookingService = {
  createBooking,
};
