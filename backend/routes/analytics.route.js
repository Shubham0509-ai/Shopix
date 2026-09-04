import { Router } from "express";
import { adminRoute, verifyJWT } from "../middlewares/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/").get(verifyJWT, adminRoute, async(req, res) => {
    try {
        const analyticsData = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    analyticsData,
                    dailySalesData
                },
                "Analytics data fetched successfully!"
            )
        )
    } catch (error) {
        console.log("Error in analytics data: ", error?.message);
        return res
        .status(500)
        .json({
            message: "Server error",
            error: error?.message
        })
    }
});

export default router;