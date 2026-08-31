import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}); // find all products
    // Product.find() always returns an Array (e.g., [] if no products exist). In JavaScript, an empty array [] is truthy, so !products will never evaluate to true
    // If the database query fails, Mongoose throws an error that asyncHandler automatically catches. If no products exist, returning an empty array [] with status 200 OK is standard REST convention

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "Products fetched successfully!")
    );
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
    // 1. Try to get from Redis cache
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
        return res
        .status(200)
        .json(
            new ApiResponse(200, JSON.parse(featuredProducts), "Featured products fetched successfully!")
        )
    }

    // 2. Cache miss -> Fetch from MongoDB
    // .lean() returns plain JavaScript objects instead of mongodb document, improving query performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    // 3. Store into Redis cache for future requests
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res
    .status(200)
    .json(
        new ApiResponse(200, featuredProducts, "Featured products fetched successfully!")
    );
});

export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, image, category } = req.body;

    if (!name || !description || price === undefined || price === null || !image || !category) {
        throw new ApiError(400, "All required fields must be provided")
    }

    let cloudinaryResponse = null;

    cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
        resource_type: "image"
    });

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        throw new ApiError(500, "Failed to upload image to Cloudinary")
    }

    const product = await Product.create({
        name,
        description,
        price,
        image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
        category
    });

    return res
    .status(201)
    .json(
        new ApiResponse(201, product, "Product created successfully!")
    )
});