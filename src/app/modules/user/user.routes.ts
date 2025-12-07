import { Router } from "express";
import { userController } from "./user.controller";
import { createGuidezodSchema } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";

const router = Router();

router.get("/", userController.getAllUserController);


router.post(
  "/create-guide",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createGuidezodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateGuideController(req, res, next);
  }
);
router.post(
  "/create-guide",
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
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createGuidezodSchema.parse(JSON.parse(req.body.data));
    return userController.ctreateAdminController(req, res, next);
  }
);

export const userRoutes = router;
