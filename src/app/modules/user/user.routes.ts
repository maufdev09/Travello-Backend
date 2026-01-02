import { Router } from "express";
import { userController } from "./user.controller";
import {  createGuideZodSchema, createUserZodSchema, updateAdminZodSchema, updateGuideZodSchema, updateTouristZodSchema } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "../../../generated/prisma/client/enums";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", 
  // auth(UserRole.ADMIN), 
  userController.getAllUserController);

router.post(
  "/create-guide",
  // auth(UserRole.ADMIN),

  fileUploader.upload.single("file"),
  
  (req, res, next) => {
    req.body = createGuideZodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateGuideController(req, res, next);
  }
);

router.post(
  "/create-tourist",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createUserZodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateTouristController(req, res, next);
  }
);
router.post(
  "/create-admin",
  // auth(UserRole.ADMIN),

  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createUserZodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateAdminController(req, res, next);
  }
);

// Get user by ID (admin only)
router.get(
  "/:id",
  auth(UserRole.ADMIN),
  userController.getUserByIdController
);



// ================= UPDATE =================

// Update Guide
router.patch(
  "/guides/:id",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = updateGuideZodSchema.parse(JSON.parse(req.body.data));
    return userController.updateGuideController(req, res, next);
  }
);

// Update Tourist
router.patch(
  "/tourists/:id",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = updateTouristZodSchema.parse(JSON.parse(req.body.data));
    return userController.updateTouristController(req, res, next);
  }
);

// Update Admin
router.patch(
  "/admins/:id",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = updateAdminZodSchema.parse(JSON.parse(req.body.data));
    return userController.updateAdminController(req, res, next);
  }
);


// ================= GET LIST =================

// Admins (admin only)
router.get(
  "/admins",
  auth(UserRole.ADMIN),
  userController.getAllAdminsController
);

// Guides (admin only)
router.get(
  "/guides",
  auth(UserRole.ADMIN),
  userController.getAllGuidesController
);

// Tourists (admin only)
router.get(
  "/tourists",
  auth(UserRole.ADMIN),
  userController.getAllTouristsController
);


// ================= GET BY ID =================

// Tourist by ID
router.get(
  "/tourists/:id",
  auth(UserRole.ADMIN),
  userController.getTouristByIdController
);

// Guide by ID
router.get(
  "/guides/:id",
  auth(UserRole.ADMIN),
  userController.getGuideByIdController
);

// Admin by ID
router.get(
  "/admins/:id",
  auth(UserRole.ADMIN),
  userController.getAdminByIdController
);


// ================= DELETE =================

// Delete Tourist
router.delete(
  "/tourists/:id",
  auth(UserRole.ADMIN),
  userController.deleteTouristByIdController
);

// Delete Guide
router.delete(
  "/guides/:id",
  auth(UserRole.ADMIN),
  userController.deleteGuideByIdController
);

// Delete Admin
router.delete(
  "/admins/:id",
  auth(UserRole.ADMIN),
  userController.deleteAdminByIdController
);



export const userRoutes = router;
