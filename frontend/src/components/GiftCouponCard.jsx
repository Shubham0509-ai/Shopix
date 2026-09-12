import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className='space-y-4 rounded-2xl glass-panel p-6 shadow-xl shadow-black/30'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400'>
						Have a voucher or gift card?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all'
						placeholder='Enter promo code (e.g. SHOP20)'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-xl gradient-btn px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 cursor-pointer'
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
			</div>
			{isCouponApplied && coupon && (
				<div className='mt-4 p-3.5 rounded-xl border border-violet-500/30 bg-violet-500/10'>
					<div className='flex items-center justify-between'>
						<div>
							<span className='text-xs font-semibold text-violet-300 uppercase tracking-wider'>Applied Coupon</span>
							<p className='text-sm font-bold text-white mt-0.5'>
								{coupon.code} <span className='text-cyan-400 font-medium'>({coupon.discountPercentage}% off)</span>
							</p>
						</div>
					</div>

					<motion.button
						type='button'
						className='mt-3 flex w-full items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 transition-all cursor-pointer'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{coupon && !isCouponApplied && (
				<div className='mt-4 p-3 rounded-xl border border-white/10 bg-white/5'>
					<h4 className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Available Voucher:</h4>
					<p className='mt-1 text-sm font-bold text-cyan-400'>
						{coupon.code} <span className='text-xs text-slate-400 font-normal'>— {coupon.discountPercentage}% discount available</span>
					</p>
				</div>
			)}
		</motion.div>
	);
};
export default GiftCouponCard;