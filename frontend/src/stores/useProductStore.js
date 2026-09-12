import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products: Array.isArray(products) ? products : [] }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			const newProduct = res.data?.data || res.data;
			set((prevState) => ({
				products: [...prevState.products, newProduct],
				loading: false,
			}));
			toast.success("Product created successfully!", { id: "create-product-success" });
		} catch (error) {
			set({ loading: false });
			const message = error.response?.data?.message || error.response?.data?.error || "Failed to create product";
			toast.error(message, { id: message });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			const prods = response.data?.data || response.data?.products || response.data || [];
			set({ products: Array.isArray(prods) ? prods : [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			const message = error.response?.data?.message || error.response?.data?.error || "Failed to fetch products";
			toast.error(message, { id: message });
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			const prods = response.data?.data || response.data?.products || response.data || [];
			set({ products: Array.isArray(prods) ? prods : [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			const message = error.response?.data?.message || error.response?.data?.error || "Failed to fetch products";
			toast.error(message, { id: message });
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevState) => ({
				products: prevState.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Product deleted successfully!", { id: "delete-product-success" });
		} catch (error) {
			set({ loading: false });
			const message = error.response?.data?.message || error.response?.data?.error || "Failed to delete product";
			toast.error(message, { id: message });
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			const updatedProduct = response.data?.data || response.data;
			set((prevState) => ({
				products: prevState.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: updatedProduct?.isFeatured ?? !product.isFeatured } : product
				),
				loading: false,
			}));
			toast.success("Featured status updated!", { id: "featured-update-success" });
		} catch (error) {
			set({ loading: false });
			const message = error.response?.data?.message || error.response?.data?.error || "Failed to update product";
			toast.error(message, { id: message });
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			const prods = response.data?.data || response.data || [];
			set({ products: Array.isArray(prods) ? prods : [], loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));