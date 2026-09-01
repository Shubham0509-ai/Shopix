import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getCartProducts);
router.route("/").post(verifyJWT, addToCart);
router.route("/").delete(verifyJWT, removeAllFromCart);
router.route("/:id").put(verifyJWT, updateQuantity);

export default router;