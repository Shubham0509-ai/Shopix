import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cartItemsSchema = new Schema({
    quantity: {
        type: Number,
        default: 1
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be atleast 6 characters long"]
    },
    cartItems: [cartItemsSchema],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET || "fallback_access_token_secret_shopix",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_token_secret_shopix",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
};

const User = mongoose.model("User", userSchema);

export default User;