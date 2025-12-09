import { fileUploader } from '../../helper/fileUploader';
import { prisma } from '../../shared/prisma';
import { Request } from "express";

 const createListing = async (req:Request) => {

   const  guideId= req.params.guideId
   const payload= req.body.data ? JSON.parse(req.body.data) : req.body;
   const files= req.files as Express.Multer.File[]
   const uploadImages: string[]=[]

     for (const file of files) {
        const result: any = await fileUploader.uloadToCloudinary(file);
        uploadImages.push(
           result.secure_url ,
        );
      }

      console.log(payload);
      console.log(uploadImages);
      

  return prisma.listing.create({
    data: {
      title: payload.title,
      description: payload.description,
      itinerary: payload.itinerary,
      price: payload.price,
      currency: payload.currency || "USD",
      durationHours: payload.durationHours,
      meetingPoint: payload.meetingPoint,
      maxGroupSize: payload.maxGroupSize,
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
        })),
      },
    },
    include: {
      availabilities: true,
      guide: true,
    },
  });
};


export const listingService={
  createListing
}