import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    let token = req.cookies?.accessToken;

    if (!token && req.header("Authorization")?.startsWith("Bearer ")) {
        token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
        throw new ApiError(401, "Unauthorized request - No access token provided");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized - Access token expired");
        }
        throw new ApiError(401, "Unauthorized - Invalid access token");
    }

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
        throw new ApiError(401, "Unauthorized - User not found or invalid token");
    }

    req.user = user;
    next();
});

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        throw new ApiError(403, "Access denied - Admin only");
    }
};