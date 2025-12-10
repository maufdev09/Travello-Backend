import { Prisma } from "../../../generated/prisma/client/client";
import { prisma } from "../../shared/prisma";

const createBooking = async (payload: any) => {
  const result = await prisma.booking.create({
    data: {
      guests: payload.guests,
      status: payload.status,
      totalPrice: payload.totalPrice,
      currency: payload.currency,

      listing: { connect: { id: payload.listingId } },
      tourist: { connect: { id: payload.touristId } },
      guide: { connect: { id: payload.guideId } },
      bookingDate: { connect: { id: payload.bookingDateId } },
    },
  });

  return result;
};

export const bookingService = {
  createBooking,
};
