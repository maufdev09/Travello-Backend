import httpStatus from "http-status";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { Prisma } from "../../../generated/prisma/client/client";
import calculatePagination from "../../helper/paginationHelper";
import { listingSearchableFields } from "./listing.contsnt";
import ApiError from "../../errors/ApiError";
import { openai } from "../../helper/open-Router";

const createListing = async (req: Request) => {
  const guideId = req.params.guideId;
  const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
  const files = req.files as Express.Multer.File[];
  const uploadImages: string[] = [];

  for (const file of files) {
    const result: any = await fileUploader.uloadToCloudinary(file);
    uploadImages.push(result.secure_url);
  }

  console.log(payload);
  console.log(uploadImages);

  return prisma.listing.create({
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
      images: uploadImages,
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
};

const getAllListingsService = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ListingWhereInput[] = [];

  // 🔍 Search
  if (searchTerm) {
    andConditions.push({
      OR: listingSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // 🔎 Exact filters (city, category, guideId, price, etc.)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: filterData[key] },
      })),
    });
  }

  // 📌 Final where condition
  const whereConditions: Prisma.ListingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 📌 Query Listings
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

  // 📌 Total count
  const total = await prisma.listing.count({
    where: whereConditions,
  });

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
export const listingService = {
  createListing,
  getAllListingsService,
  getlistingSuggestion,
};
