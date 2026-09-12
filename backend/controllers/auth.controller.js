import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { redis } from "../lib/redis.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found for token generation");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error?.message);
        throw new ApiError(500, error.message || "Something went wrong while generating refresh and access token");
    }
};

const storeRefreshToken = async (userId, refreshToken) => {
    try {
        if (redis) {
            await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
        }
    } catch (error) {
        console.warn("Warning: Redis storeRefreshToken error (proceeding with session):", error?.message);
    }
};

const setCookies = (res, accessToken, refreshToken) => {
	const isProd = process.env.NODE_ENV === "production";
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? "strict" : "lax",
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? "strict" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};


export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existedUser = await User.findOne({ email: normalizedEmail });

    if (existedUser) {
        throw new ApiError(400, "User with this email already exists!");
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while signing up the user!");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);
    await storeRefreshToken(createdUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User signed up successfully!")
    );
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "User credentials are required!");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        throw new ApiError(404, "User does not exist with this email");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const loggedInUser = user.toObject();
    delete loggedInUser.password;

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    await storeRefreshToken(loggedInUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res
    .status(200)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in successfully!")
    );
});

export const logout = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized - User session not found");
    }

    try {
        if (redis) {
            await redis.del(`refresh_token:${req.user._id}`);
        }
    } catch (error) {
        console.warn("Warning: Redis del refresh token error:", error?.message);
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, {}, "User logged out successfully!")
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request - No refresh token provided");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_token_secret_shopix");
    } catch (error) {
        throw new ApiError(401, "Unauthorized - Expired or invalid refresh token");
    }

    let storedToken = null;
    try {
        if (redis) {
            storedToken = await redis.get(`refresh_token:${decodedToken._id}`);
        }
    } catch (error) {
        console.warn("Warning: Redis get refresh token error:", error?.message);
    }

    if (storedToken && storedToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid or reused refresh token!");
    }

    const accessToken = jwt.sign(
        { 
            _id: decodedToken._id 
        },
        process.env.ACCESS_TOKEN_SECRET || "fallback_access_token_secret_shopix",
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" 
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, { accessToken }, "Access token refreshed successfully!")
    );
});

export const getProfile = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "User details fetched successfully!")
    );
});