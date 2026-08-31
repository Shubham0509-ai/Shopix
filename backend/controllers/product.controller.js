import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}); // find all products
    // Product.find() always returns an Array (e.g., [] if no products exist). In JavaScript, an empty array [] is truthy, so !products will never evaluate to true
    // If the database query fails, Mongoose throws an error that asyncHandler automatically catches. If no products exist, returning an empty array [] with status 200 OK is standard REST convention

    return res
    .status(200)
    .json(
        new ApiResponse(200, products, "Products fetched successfully!")
    )
});