import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/create-bookings", bookingController.ctreateBookingController);

export const bookingsRoutes = router;
