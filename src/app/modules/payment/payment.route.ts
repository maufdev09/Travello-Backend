import { Router } from "express";
import { bookingController } from "../booking/booking.controller";
import { PaymentController } from "./payment.controller";

const router = Router();
router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.get("/success", PaymentController.successPayment);
router.get("/fail", PaymentController.failPayment);
router.get("/cancel", PaymentController.cancelPayment);


export const paymentsRoutes = router;
