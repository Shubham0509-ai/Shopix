import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	if (!product) return null;

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(product);
		}
	};

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-2xl glass-panel group hover:border-violet-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-black/30'>
			<div className='relative aspect-square overflow-hidden bg-[#121524]'>
				<img
					className='object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105'
					src={product.image}
					alt={product.name}
					onError={(e) => {
						e.currentTarget.onerror = null;
						e.currentTarget.src = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80";
					}}
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-[#08090f]/70 via-transparent to-transparent opacity-60' />
				{product.category && (
					<span className='absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/50 backdrop-blur-md text-violet-300 border border-white/10'>
						{product.category}
					</span>
				)}
			</div>

			<div className='p-5 flex flex-col flex-grow justify-between'>
				<div>
					<h4 className='text-lg font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors line-clamp-1'>{product.name}</h4>
					{product.description && (
						<p className='text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed'>{product.description}</p>
					)}
				</div>

				<div className='mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3'>
					<div>
						<span className='text-xs text-slate-400 block'>Price</span>
						<span className='text-2xl font-black text-white'>
							${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
						</span>
					</div>

					<button
						className='gradient-btn text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer'
						onClick={handleAddToCart}
					>
						<ShoppingCart size={17} />
						<span>Add</span>
					</button>
				</div>
			</div>
		</div>
	);
};
export default ProductCard;