import { Router } from "express";
import { adminRoute, verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllProducts } from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, getAllProducts);

export default router;