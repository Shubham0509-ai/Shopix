import { Navigate, Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className='min-h-screen bg-[#07080e] text-slate-100 relative overflow-hidden selection:bg-violet-600/30 selection:text-violet-200'>
			{/* Ambient Aurora Glow Background */}
			<div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
				<div className='absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl rounded-full' />
				<div className='absolute top-[20%] -right-[10%] w-[600px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full' />
				<div className='absolute bottom-[10%] -left-[10%] w-[600px] h-[500px] bg-fuchsia-600/10 blur-3xl rounded-full' />
				<div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]' />
			</div>

			<div className='relative z-20 pt-20'>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route
						path='/secret-dashboard'
						element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
					/>
					<Route path='/category/:category' element={<CategoryPage />} />
					<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
					<Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
				</Routes>
			</div>
			<Toaster
				position='top-center'
				toastOptions={{
					style: {
						background: 'rgba(15, 18, 30, 0.9)',
						color: '#f8fafc',
						border: '1px solid rgba(255, 255, 255, 0.1)',
						backdropFilter: 'blur(12px)',
						boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
					},
				}}
			/>
		</div>
	);
}

export default App;