import httpStatus from "http-status";
import {
  BookingStatus,
  PaymentStatus,
} from "../../../generated/prisma/client/enums";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const initPayment = async (bookingId: string) => {
  const bookingData = await prisma.booking.findUnique({
    where: { id: bookingId },

    include: {
      tourist: true, // 👈 Populate tourist
      guide: true, // optional
      listing: true, // optional
      bookingDate: true, // optional
    },
  });

  if (!bookingData) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const PaymentData = await prisma.payment.findUnique({
    where: {
      bookingId: bookingData.id,
    },
  });
  if (!PaymentData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Payment data not found for this booking"
    );
  }

  if (!PaymentData.transactionId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Transaction ID not found in payment data"
    );
  }

  const result = await prisma.$transaction(async (tnx) => {
    const sslPayload: ISSLCommerz = {
      email: bookingData.tourist?.email || "",
      phoneNumber: bookingData?.tourist?.contactNumber || "",
      name: bookingData.tourist?.name || "",
      amount: bookingData.totalPrice,
      transactionId: PaymentData.transactionId ?? undefined,
      bookingDateId: bookingData.bookingDateId,
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

const successPayment = async (query: Record<string, string>) => {
  const result = await prisma.$transaction(async (tnx) => {
    const payment = await tnx.payment.update({
      where: {
        transactionId: query.transactionId as string,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    const booking = await tnx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
      },
    });
    const availability = await tnx.availability.update({
      where: {
        id: query.bookingDateId as string,
      },
      data: {
        booked: true,
      },
    });

    return {
      success: true,
      message: "Payment successful",
    };
  });
  return result;
};

const failPayment = async (query: Record<string, string>) => {
  const result = await prisma.$transaction(async (tnx) => {
    const payment = await tnx.payment.update({
      where: {
        transactionId: query.transactionId as string,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    const booking = await tnx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.FAILED,
      },
    });
    const availability = await tnx.availability.update({
      where: {
        id: query.bookingDateId as string,
      },
      data: {
        booked: false,
      },
    });

    return {
      success: false,
      message: "Payment failed",
    };
  });
  return result;
};

const cancelPayment = async (query: Record<string, string>) => {
  const result = await prisma.$transaction(async (tnx) => {
    const payment = await tnx.payment.update({
      where: {
        transactionId: query.transactionId as string,
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    const booking = await tnx.booking.update({
      where: {
        id: payment.bookingId,
      },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.FAILED
      },
    });
    const availability = await tnx.availability.update({
      where: {
        id: query.bookingDateId as string,
      },
      data: {
        booked: false,
      },
    });

    return {
      success: false,
      message: "Payment Cancelled ",
    };
  });
  return result;
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment
};
