import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async() => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    
};