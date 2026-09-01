import { asyncHandler } from "../utils/asyncHandler.js";
import Coupon from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findOne({ 
        userId: req.user._id, 
        isActive: true,
        expirationDate: { 
            $gt: new Date() 
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, coupon || null, "Coupon fetched successfully!")
    )
});

export const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        throw new ApiError(400, "Coupon code is required")
    }

    const coupon = await Coupon.findOne({ 
        code, 
        userId: req.user._id, 
        isActive: true 
    });

    if (!coupon) {
        throw new ApiError(404, "Coupon not found!")
    }

    if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();

        throw new ApiError(400, "Coupon has expired!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                code: coupon.code,
                discountPercentage: coupon.discountPercentage
            }, 
            "Coupon validated successfully!")
    )
});