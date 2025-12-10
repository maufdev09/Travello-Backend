import { Router } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { lstingController } from "./listing.controller";

const router = Router();

router.post(
  "/create-listing/:guideId",
  fileUploader.upload.array("file", 10),

  lstingController.ctreateListingController
);

router.get("/", lstingController.getAllListingController);

router.post("/suggestion" , lstingController.getlistingSuggestion);

export const listingRoutes = router;
