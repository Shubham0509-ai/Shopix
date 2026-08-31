import { Router } from "express";
import { adminRoute, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, getAllProducts);
router.route("/featured").get(getFeaturedProducts);
router.route("/").post(verifyJWT, adminRoute, createProduct);

export default router;