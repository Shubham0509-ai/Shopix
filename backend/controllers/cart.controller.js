import Product from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCartProducts = asyncHandler(async (req, res) => {
    const user = req.user;

    const productIds = user.cartItems.map((item) => item.product);

    const products = await Product.find({
        _id: {
            $in: productIds
        }
    });

    const cartItems = products.map((product) => {
        const item = user.cartItems.find((cartItem) => cartItem.product?.toString() === product._id?.toString());
        return { ...product.toJSON(), quantity: item.quantity };
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, cartItems, "Cart items fetched successfully!")
    )
});

export const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.product?.toString() === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cartItems.push({ product: productId });
    }

    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, user.cartItems, "Item added to cart successfully!")
    )
});

export const removeAllFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
        user.cartItems = [];
    } else {
        user.cartItems = user.cartItems.filter((item) => item.product?.toString() !== productId);
    }

    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, user.cartItems, "Item completely removed from cart!")
    )
});

export const updateQuantity = asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const item = user.cartItems.find((item) => item.product?.toString() === productId);

    if (item) {
        if (quantity === 0) {
            user.cartItems = user.cartItems.filter((item) => item.product?.toString() !== productId);
        } else {
            item.quantity = quantity;
        }
    } else {
        throw new ApiError(404, "Product not found!")
    }

    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, user.cartItems, "Item quantity updated successfully!")
    )
});