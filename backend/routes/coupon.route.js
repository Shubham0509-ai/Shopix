import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getCoupon);
router.route("/validate").post(verifyJWT, validateCoupon);

export default router;