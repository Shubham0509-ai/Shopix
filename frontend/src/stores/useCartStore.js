import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupon");
			const couponData = response.data?.data !== undefined ? response.data.data : response.data;
			set({ coupon: couponData });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupon/validate", { code });
			const couponData = response.data?.data || response.data;
			set({ coupon: couponData, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully", { id: "coupon-success" });
		} catch (error) {
			const message = error.response?.data?.message || "Failed to apply coupon";
			toast.error(message, { id: message });
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed", { id: "coupon-remove-success" });
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			const items = res.data?.data || res.data || [];
			set({ cart: Array.isArray(items) ? items : [] });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			const message = error.response?.data?.message || "An error occurred fetching cart";
			toast.error(message, { id: message });
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
	},
	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart", { id: "add-cart-success" });

			set((prevState) => {
				const currentCart = Array.isArray(prevState.cart) ? prevState.cart : [];
				const existingItem = currentCart.find((item) => item._id === product._id);
				const newCart = existingItem
					? currentCart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...currentCart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			const message = error.response?.status === 401
				? "Please log in to add items to your cart"
				: (error.response?.data?.message || "An error occurred adding to cart");
			toast.error(message, { id: "cart-auth-error" });
		}
	},
	removeFromCart: async (productId) => {
		try {
			await axios.delete(`/cart`, { data: { productId } });
			set((prevState) => {
				const currentCart = Array.isArray(prevState.cart) ? prevState.cart : [];
				return { cart: currentCart.filter((item) => item._id !== productId) };
			});
			get().calculateTotals();
		} catch (error) {
			const message = error.response?.status === 401
				? "Please log in to manage your cart"
				: (error.response?.data?.message || "Failed to remove item");
			toast.error(message, { id: message });
		}
	},
	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		try {
			await axios.put(`/cart/${productId}`, { quantity });
			set((prevState) => {
				const currentCart = Array.isArray(prevState.cart) ? prevState.cart : [];
				return {
					cart: currentCart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
				};
			});
			get().calculateTotals();
		} catch (error) {
			const message = error.response?.status === 401
				? "Please log in to manage your cart"
				: (error.response?.data?.message || "Failed to update quantity");
			toast.error(message, { id: message });
		}
	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const validCart = Array.isArray(cart) ? cart : [];
		const subtotal = validCart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
		let total = subtotal;

		if (coupon && coupon.discountPercentage) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = Math.max(0, subtotal - discount);
		}

		set({ subtotal, total });
	},
}));