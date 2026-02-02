import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { lstingController } from "./listing.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client/enums";

const router = Router();

router.post(
  "/create-listing/:guideId",
  fileUploader.upload.single("file"),
  lstingController.ctreateListingController
);

router.get("/", auth(UserRole.GUIDE),lstingController.getAllListingController);

router.get("/public", lstingController.getAllListingsPublicController);

router.get("/:id", lstingController.getListingByIdController);

router.post("/suggestion" , lstingController.getlistingSuggestion);
router.delete("/:id", lstingController.deleteListingController);



export const listingRoutes = router;
