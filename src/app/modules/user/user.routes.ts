import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import {
  createGuideZodSchema,
  createUserZodSchema,
  updateAdminZodSchema,
  updateGuideZodSchema,
  updateTouristZodSchema,
} from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "../../../generated/prisma/client/enums";
import auth from "../../middlewares/auth";

const router = Router();

// ================= ROOT =================
router.get(
  "/",
  // auth(UserRole.ADMIN),
  userController.getAllUserController
);

// ================= CREATE =================

// Create Guide
router.post(
  "/create-guide",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createGuideZodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateGuideController(req, res, next);
  }
);

// Create Tourist
router.post(
  "/create-tourist",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createUserZodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateTouristController(req, res, next);
  }
);

// Create Admin
router.post(
  "/create-admin",
  // auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createUserZodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateAdminController(req, res, next);
  }
);

// ================= GET LIST =================

// Admins
router.get(
  "/admins",
  auth(UserRole.ADMIN),
  userController.getAllAdminsController
);

// Guides
router.get(
  "/guides",
  // auth(UserRole.ADMIN),
  userController.getAllGuidesController
);

// Tourists
router.get(
  "/tourists",
  auth(UserRole.ADMIN),
  userController.getAllTouristsController
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

// ================= GENERIC (MUST BE LAST) =================

// Get User by ID
router.get(
  "/:id",
  auth(UserRole.ADMIN),
  userController.getUserByIdController
);

router.patch(
    "/update-my-profile",
    auth( UserRole.ADMIN, UserRole.TOURIST, UserRole.GUIDE),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return userController.updateMyProfie(req, res, next)
    }
);

export const userRoutes = router;
