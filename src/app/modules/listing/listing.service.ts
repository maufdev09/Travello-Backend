import { Result } from './../../../generated/prisma/client/internal/prismaNamespace';
import httpStatus from "http-status";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { Prisma } from "../../../generated/prisma/client/client";
import calculatePagination from "../../helper/paginationHelper";
import { listingSearchableFields } from "./listing.contsnt";
import ApiError from "../../errors/ApiError";
import { openai } from "../../helper/open-Router";
import { JwtPayload } from 'jsonwebtoken';

const createListing = async (req: Request) => {
  const guideId = req.params.guideId;
  const payload = req.body.data ? JSON.parse(req.body.data) : req.body;




  const guideExists = await prisma.guide.findUnique({
  where: { id: guideId },
});

if (!guideExists) {
  throw new ApiError(
    4565,
    "Guide not found with this ID"
  );
}


  let uploadResult
  if (req.file) {
 uploadResult = await fileUploader.uloadToCloudinary(req.file);
    
  }



 const Result = await prisma.listing.create({
    data: {
      title: payload.title,
      description: payload.description,
      itinerary: payload.itinerary,
      price: Number(payload.price),
      currency: payload.currency || "USD",
      durationHours: Number(payload.durationHours),
      meetingPoint: payload.meetingPoint,
      maxGroupSize: Number(payload.maxGroupSize),
      city: payload.city,
      category: payload.category,
      images:  uploadResult?.secure_url,
      guide: {
        connect: {
          id: guideId,
        },
      },
      availabilities: {
        create: payload.availabilities?.map((slot: any) => ({
          startAt: new Date(slot.startAt),
          endAt: new Date(slot.endAt),
          note: slot.note || null,
          guide: { connect: { id: guideId } },  

        })),
      },
    },
    include: {
      availabilities: true,
      guide: true,
    },
  });

  

  return Result;
};

const getAllListingsService = async (
  params: any,
  options: any,
  decodedToken: JwtPayload
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ListingWhereInput[] = [];

  /* ------------------------------------------------------------------ */
  /* 🔐 STEP 1: Find guide by email from token                           */
  /* ------------------------------------------------------------------ */
  if (!decodedToken?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }

  const guide = await prisma.guide.findUnique({
    where: { email: decodedToken.email },
    select: { id: true },
  });

  if (!guide) {
    throw new ApiError(httpStatus.NOT_FOUND, "Guide not found");
  }

  /* ------------------------------------------------------------------ */
  /* 🔐 STEP 2: Force guideId filter                                     */
  /* ------------------------------------------------------------------ */
  andConditions.push({
    guideId: guide.id,
  });

  /* ---------------------------- Search ------------------------------- */
  if (searchTerm) {
    andConditions.push({
      OR: listingSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  /* ----------------------- Optional Filters -------------------------- */
  if (filterData.city) {
    andConditions.push({ city: filterData.city });
  }

  if (filterData.category) {
    andConditions.push({ category: filterData.category });
  }

  if (filterData.isActive !== undefined) {
    andConditions.push({ isActive: filterData.isActive });
  }

  /* ----------------------- Final where ------------------------------- */
  const whereConditions: Prisma.ListingWhereInput = {
    AND: andConditions,
  };

  /* ------------------------ Query ----------------------------------- */
  const listings = await prisma.listing.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: { [sortBy]: sortOrder },
    include: {
      guide: true,
      availabilities: true,
      reviews: true,
      bookings: true,
    },
  });

  const total = await prisma.listing.count({
    where: whereConditions,
  });

  console.log("hello from getAllListings",listings);
  
  return {
    meta: { page, limit, total },
    data: listings,
  };
};

const getlistingSuggestion = async (payload: { suggestion: string }) => {
  if (!(payload && payload.suggestion)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Suggestion text is required");
  }

  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
    },
    include: {
      guide: true,
      availabilities: true,
      reviews: true,
      bookings: true,
    },
  });

  const prompt = `
User is looking for: "${payload.suggestion}"

Here is the list of available tours:

${JSON.stringify(listings, null, 2)}

Your task:
1. Read all listings.
2. Compare them to the user's requested tour type.
3. Select the TOP 5 most relevant tours.
4. Return ONLY valid JSON in this format with full listing details
`;

  const completion = await openai.chat.completions.create({
    model: "z-ai/glm-4.5-air:free",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that helps users find suitable tour listings based on their preferences.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawContent = completion.choices[0].message.content;

  if (!rawContent) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "No response from AI");
  }

  // Remove code block formatting (```json ... ```)
  const cleaned = rawContent
    .replace(/^```json/, "")
    .replace(/```$/, "")
    .trim();

  // Convert string → JSON object
  let listingData;
  try {
    listingData = JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse error:", e);
  }
  return listingData;
};

const deleteListing = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  await prisma.$transaction(async (tx) => {
    // ✅ 1. Delete all availabilities of this listing
    await tx.availability.deleteMany({
      where: {
        listingId: listingId,
      },
    });

    // ✅ 2. Delete listing
    await tx.listing.delete({
      where: { id: listingId },
    });
  });

  return null;
};

const getAllListingsPublic = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ListingWhereInput[] = [];

  // Only show active listings for public
  andConditions.push({
    isActive: true,
  });

  /* ---------------------------- Search ------------------------------- */
  if (searchTerm) {
    andConditions.push({
      OR: listingSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  /* ----------------------- Optional Filters -------------------------- */
  if (filterData.city) {
    andConditions.push({ city: filterData.city });
  }

  if (filterData.category) {
    andConditions.push({ category: filterData.category });
  }

  /* ----------------------- Final where ------------------------------- */
  const whereConditions: Prisma.ListingWhereInput = {
    AND: andConditions,
  };

  /* ------------------------ Query ----------------------------------- */
  const listings = await prisma.listing.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: { [sortBy]: sortOrder },
    include: {
      guide: true,
      availabilities: true,
      reviews: true,
      bookings: true,
    },
  });

  const total = await prisma.listing.count({
    where: whereConditions,
  });

  return {
    meta: { page, limit, total },
    data: listings,
  };
};

const getListingById = async (listingId: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId, isActive: true },
    include: {
      guide: true,
      availabilities: true,
      reviews: true,
      bookings: true,
    },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  return listing;
};


export const listingService = {
  createListing,
  getAllListingsService,
  getlistingSuggestion,
  deleteListing,
  getAllListingsPublic,
  getListingById
};
