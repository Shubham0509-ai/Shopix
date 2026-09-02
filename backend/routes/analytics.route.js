import { Router } from "express";
import { adminRoute, verifyJWT } from "../middlewares/auth.middleware.js";
import { getAnalyticsData } from "../controllers/analytics.controller.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, async(req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
    } catch (error) {
        
    }
});

export default router;