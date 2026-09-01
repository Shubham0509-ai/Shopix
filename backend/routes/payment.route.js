import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = Router();

router.route("/create-checkout-session").post(verifyJWT, createCheckoutSession);
router.route("/checkout-success").post(verifyJWT, checkoutSuccess);

export default router;
