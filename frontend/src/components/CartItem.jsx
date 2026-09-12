import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='rounded-2xl border border-white/10 glass-panel p-5 shadow-lg shadow-black/20'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-[#121524] border border-white/10'>
					<img
						className='w-full h-full object-cover'
						src={item.image}
						alt={item.name}
						onError={(e) => {
							e.currentTarget.onerror = null;
							e.currentTarget.src = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80";
						}}
					/>
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex items-center justify-between md:order-3 md:justify-end gap-6'>
					<div className='flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 rounded-xl'>
						<button
							className='inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer'
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus size={14} />
						</button>
						<span className='w-8 text-center text-sm font-bold text-white'>{item.quantity}</span>
						<button
							className='inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer'
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus size={14} />
						</button>
					</div>

					<div className='text-end md:w-28'>
						<p className='text-lg font-bold text-white'>
							${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
						</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md'>
					<p className='text-base font-semibold text-white hover:text-violet-300 transition-colors'>
						{item.name}
					</p>
					<p className='text-xs text-slate-400 line-clamp-1'>{item.description}</p>

					<div className='flex items-center pt-1'>
						<button
							className='inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors cursor-pointer'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash size={14} />
							<span>Remove</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CartItem;