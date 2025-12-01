import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createGuidezodSchema } from "./user.validation";

const router = Router();

router.post(
  "/create-guide",
  validateRequest(createGuidezodSchema),
  userController.ctreateGuideController
);

export const userRoutes = router;
