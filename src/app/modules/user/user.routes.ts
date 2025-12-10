import { Router } from "express";
import { userController } from "./user.controller";
import { createGuidezodSchema } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";
import { UserRole } from "../../../generated/prisma/client/enums";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", auth(UserRole.ADMIN), userController.getAllUserController);

router.post(
  "/create-guide",
  // auth(UserRole.ADMIN),

  fileUploader.upload.single("file"),
  
  (req, res, next) => {
    req.body = createGuidezodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateGuideController(req, res, next);
  }
);

router.post(
  "/create-tourist",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createGuidezodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateTouristController(req, res, next);
  }
);
router.post(
  "/create-admin",
  // auth(UserRole.ADMIN),

  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createGuidezodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateAdminController(req, res, next);
  }
);

export const userRoutes = router;
