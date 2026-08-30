import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { redis } from "../lib/redis.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
};

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};


export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => !field || field.trim() === "") // field? (Optional Chaining): Prevents crashes if field is null or undefined.
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "User with email already exists!")
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while signing up the user!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(createdUser._id);
    storeRefreshToken(createdUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User signed up successfully!")
    )
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "User credentials are required!")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // Optimization: Remove the password from the existing user object 
    // instead of querying the database a second time.
    const loggedInUser = user.toObject();
    delete loggedInUser.password;

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    storeRefreshToken(loggedInUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    return res
    .status(201)
    .json(
        new ApiResponse(201, loggedInUser, "User logged in successfully!")
    )
});

export const logout = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized - User session not found")
    }

    await redis.del(`refresh_token:${req.user._id}`);

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, {}, "User logged out successfully!")
    )
});