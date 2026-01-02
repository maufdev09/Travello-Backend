import z from "zod";

export const createUserZodSchema = z.object({
  password: z.string(),
  data: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email(),
    address: z.string().optional(),
  }),
});
export const createTouristZodSchema = z.object({
  data: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    profilePhoto: z.string().optional(),
    preferences: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
  password: z.string().min(6),
});

export const createAdminZodSchema = z.object({
  data: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
  password: z.string().min(6),
});
export const createGuideZodSchema = z.object({
  data: z.object({
    name: z.string().min(1),
    email: z.email(),
    profilePhoto: z.string().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).optional(),
    expertise: z.array(z.string()).optional(),
    dailyRate: z.number().int().positive().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
  password: z.string().min(6),
});

export const updateTouristZodSchema = z.object({
  data: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    preferences: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});
export const updateGuideZodSchema = z.object({
  data: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).optional(),
    expertise: z.array(z.string()).optional(),
    dailyRate: z.number().int().positive().optional(),
    verificationStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const updateAdminZodSchema = z.object({
  data: z.object({
    name: z.string().min(1).optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});
