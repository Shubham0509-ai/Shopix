import { Link } from "react-router";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
	const { cart } = useCartStore();
	const cartItems = Array.isArray(cart) ? cart : [];

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-7xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cartItems.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-6'>
								{cartItems.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}
						{cartItems.length > 0 && <PeopleAlsoBought />}
					</motion.div>

					{cartItems.length > 0 && (
						<motion.div
							className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary />
							<GiftCouponCard />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};
export default CartPage;

const EmptyCartUI = () => (
	<motion.div
		className='flex flex-col items-center justify-center space-y-5 py-20 px-6 glass-panel rounded-3xl text-center max-w-lg mx-auto shadow-2xl shadow-black/40'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-violet-500/10'>
			<ShoppingCart className='h-10 w-10 text-violet-400' />
		</div>
		<h3 className='text-2xl font-black text-white tracking-tight'>Your cart is empty</h3>
		<p className='text-sm text-slate-400 max-w-sm'>
			Discover our curated collection of luxury apparel and state-of-the-art essentials.
		</p>
		<Link
			className='mt-2 inline-flex items-center justify-center rounded-xl gradient-btn px-8 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 cursor-pointer'
			to='/'
		>
			Start Shopping
		</Link>
	</motion.div>
);