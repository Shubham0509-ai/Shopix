import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payment/checkout-success", {
					sessionId,
				});
				clearCart();
			} catch (error) {
				console.error("Checkout success error:", error);
				setError(error.response?.data?.message || "Failed to process order confirmation");
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart]);

	if (isProcessing) {
		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center px-4'>
				<div className='w-14 h-14 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin mb-4' />
				<p className='text-slate-300 font-semibold text-sm'>Verifying payment security token...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-[70vh] flex items-center justify-center px-4'>
				<div className='max-w-md w-full glass-panel rounded-3xl p-8 text-center border border-rose-500/20'>
					<h2 className='text-xl font-bold text-rose-400 mb-2'>Payment Verification Failed</h2>
					<p className='text-sm text-slate-400 mb-6'>{error}</p>
					<Link to='/' className='inline-flex gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold text-white'>
						Return to Shop
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-[85vh] flex items-center justify-center px-4 py-12'>
			<Confetti
				width={typeof window !== "undefined" ? window.innerWidth : 1000}
				height={typeof window !== "undefined" ? window.innerHeight : 800}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={600}
				recycle={false}
			/>

			<div className='max-w-md w-full glass-panel rounded-3xl shadow-2xl shadow-black/50 overflow-hidden relative z-10 border border-white/15 p-8 text-center'>
				<div className='w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-white/15 flex items-center justify-center shadow-lg shadow-cyan-500/10 mb-6'>
					<CheckCircle className='text-cyan-400 w-10 h-10' />
				</div>

				<h1 className='text-3xl font-black text-white tracking-tight mb-2'>
					Payment <span className='gradient-text'>Confirmed!</span>
				</h1>

				<p className='text-slate-300 text-sm mb-1'>
					Thank you for your order. We are preparing your shipment.
				</p>
				<p className='text-xs text-cyan-400 mb-6 font-medium'>
					A confirmation receipt has been dispatched to your email.
				</p>

				<div className='bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 space-y-2 text-left'>
					<div className='flex items-center justify-between text-xs'>
						<span className='text-slate-400'>Order Reference</span>
						<span className='font-bold text-violet-300 tracking-wider font-mono'>#SPX-{Math.floor(10000 + Math.random() * 90000)}</span>
					</div>
					<div className='flex items-center justify-between text-xs'>
						<span className='text-slate-400'>Estimated Delivery</span>
						<span className='font-semibold text-white'>3–5 Business Days</span>
					</div>
				</div>

				<div className='space-y-3'>
					<button
						className='w-full gradient-btn text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-violet-600/25 transition duration-200 flex items-center justify-center cursor-pointer text-sm'
					>
						<HandHeart className='mr-2' size={18} />
						Thank you for shopping with us
					</button>
					<Link
						to={"/"}
						className='w-full glass-panel hover:bg-white/10 text-cyan-400 hover:text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center text-sm cursor-pointer border border-white/10'
					>
						Explore More Styles
						<ArrowRight className='ml-2' size={18} />
					</Link>
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;