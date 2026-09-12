import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		if (get().loading) return;
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match", { id: "password-mismatch" });
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			const userData = res.data?.data || res.data;
			set({ user: userData });
			toast.success("Account created successfully!", { id: "signup-success" });
		} catch (error) {
			const message = error.response?.data?.message || error.message || "An error occurred during signup";
			toast.error(message, { id: message });
		} finally {
			set({ loading: false });
		}
	},
	login: async (email, password) => {
		if (get().loading) return;
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });
			const userData = res.data?.data || res.data;
			set({ user: userData });
			toast.success("Logged in successfully!", { id: "login-success" });
		} catch (error) {
			const message = error.response?.data?.message || error.message || "An error occurred during login";
			toast.error(message, { id: message });
		} finally {
			set({ loading: false });
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
		} catch (error) {
			console.log("Logout error:", error?.message);
		} finally {
			set({ user: null });
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			const userData = response.data?.data || response.data;
			set({ user: userData, checkingAuth: false });
		} catch (error) {
			console.log("Auth check:", error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data?.data || response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry &&
			!originalRequest.url?.includes("/auth/login") &&
			!originalRequest.url?.includes("/auth/signup") &&
			!originalRequest.url?.includes("/auth/refresh-token")
		) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			} finally {
				refreshPromise = null;
			}
		}
		return Promise.reject(error);
	}
);