import { Router } from "express";
import { adminRoute, verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, getAllProducts);
router.route("/featured").get(getFeaturedProducts);
router.route("/recommendations").get(getRecommendedProducts);
router.route("/category/:category").get(getProductsByCategory);

router.route("/").post(verifyJWT, adminRoute, createProduct);
router.route("/:id").patch(verifyJWT, adminRoute, toggleFeaturedProduct);
router.route("/:id").delete(verifyJWT, adminRoute, deleteProduct);


export default router;