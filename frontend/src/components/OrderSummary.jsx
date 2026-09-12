import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
	"pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
);

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const validSubtotal = typeof subtotal === "number" ? subtotal : 0;
	const validTotal = typeof total === "number" ? total : 0;
	const savings = validSubtotal - validTotal;
	const formattedSubtotal = validSubtotal.toFixed(2);
	const formattedTotal = validTotal.toFixed(2);
	const formattedSavings = Math.max(0, savings).toFixed(2);

	const handlePayment = async () => {
		try {
			const stripe = await stripePromise;
			const res = await axios.post("/payment/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});

			const session = res.data?.data || res.data;
			if (!session?.id) {
				throw new Error("No checkout session returned from server");
			}

			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});

			if (result.error) {
				console.error("Stripe error:", result.error);
				const msg = result.error.message || "Failed to redirect to checkout";
				toast.error(msg, { id: msg });
			}
		} catch (error) {
			const msg = error.response?.data?.message || error.message || "Checkout failed";
			toast.error(msg, { id: msg });
		}
	};

	return (
		<motion.div
			className='space-y-5 rounded-2xl glass-panel p-6 shadow-xl shadow-black/30'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<h3 className='text-xl font-bold text-white tracking-tight flex items-center justify-between'>
				<span>Order Summary</span>
				<span className='text-xs font-normal text-slate-400'>Secure Checkout</span>
			</h3>

			<div className='space-y-4'>
				<div className='space-y-2.5 text-sm'>
					<dl className='flex items-center justify-between'>
						<dt className='text-slate-400'>Original price</dt>
						<dd className='font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between text-cyan-400'>
							<dt>Savings</dt>
							<dd className='font-semibold'>-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between text-violet-400'>
							<dt>Coupon ({coupon.code})</dt>
							<dd className='font-semibold'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}

					<dl className='flex items-center justify-between border-t border-white/10 pt-3 text-base'>
						<dt className='font-bold text-white'>Total</dt>
						<dd className='text-xl font-black gradient-text'>${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='w-full gradient-btn py-3 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center cursor-pointer shadow-lg shadow-violet-600/30'
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2 pt-1'>
					<span className='text-xs text-slate-500'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors'
					>
						<span>Continue Shopping</span>
						<MoveRight size={13} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;