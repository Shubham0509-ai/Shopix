import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        "http://localhost:5173",
        process.env.CLIENT_URL
    ].filter(Boolean);

    if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === "development")) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Centralized JSON error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        statusCode,
        data: null,
        message,
        success: false,
        errors: err.errors || []
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});