import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createGuidezodSchema } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";

const router = Router();

router.post(
  "/create-guide",
  fileUploader.upload.single("file"),
  (req, res, next) => {
    req.body = createGuidezodSchema.parse(
      JSON.parse(req.body.data)
    );
    return userController.ctreateGuideController(req, res, next);
  }
);

export const userRoutes = router;
