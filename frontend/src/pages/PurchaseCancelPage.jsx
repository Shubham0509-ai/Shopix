import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const PurchaseCancelPage = () => {
	return (
		<div className='min-h-[85vh] flex items-center justify-center px-4 py-12'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full glass-panel rounded-3xl shadow-2xl shadow-black/50 overflow-hidden relative z-10 border border-white/10 p-8 text-center'
			>
				<div className='w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/10 mb-6'>
					<XCircle className='text-rose-400 w-10 h-10' />
				</div>

				<h1 className='text-3xl font-black text-white tracking-tight mb-2'>
					Order <span className='text-rose-400'>Cancelled</span>
				</h1>

				<p className='text-slate-300 text-sm mb-6'>
					No charges were applied to your payment method.
				</p>

				<div className='bg-white/5 rounded-2xl p-4 mb-6 border border-white/10'>
					<p className='text-xs text-slate-400 leading-relaxed'>
						Encountered an issue or changed your mind? Your items are safely saved in your shopping cart whenever you wish to return.
					</p>
				</div>

				<div>
					<Link
						to={"/cart"}
						className='w-full gradient-btn text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-violet-600/25 transition duration-200 flex items-center justify-center text-sm cursor-pointer mb-3'
					>
						Review Cart
					</Link>
					<Link
						to={"/"}
						className='w-full glass-panel hover:bg-white/10 text-slate-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center text-sm cursor-pointer border border-white/10'
					>
						<ArrowLeft className='mr-2' size={16} />
						Return to Catalog
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;