import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts = [] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();
	const productsList = Array.isArray(featuredProducts) ? featuredProducts : [];

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	if (productsList.length === 0) return null;

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= productsList.length - itemsPerPage;

	return (
		<div className='py-16'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between mb-8'>
					<div>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full glow-pill text-xs font-semibold uppercase tracking-wider mb-2'>
							Spotlight
						</div>
						<h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-white'>
							Featured <span className='gradient-text'>Products</span>
						</h2>
					</div>
				</div>

				<div className='relative'>
					<div className='overflow-hidden py-4 -my-4'>
						<div
							className='flex transition-transform duration-500 ease-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{productsList.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 shrink-0 px-3'>
									<div className='glass-panel rounded-2xl overflow-hidden h-full flex flex-col justify-between group hover:border-violet-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-black/30'>
										<div className='relative overflow-hidden aspect-square bg-[#121524]'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
												onError={(e) => {
													e.currentTarget.onerror = null;
													e.currentTarget.src = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80";
												}}
											/>
											<div className='absolute top-3 right-3 bg-[#08090f]/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-violet-300'>
												${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
											</div>
										</div>
										<div className='p-5 flex flex-col flex-grow justify-between'>
											<div className='mb-4'>
												<h3 className='text-base font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1'>{product.name}</h3>
												<p className='text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed'>{product.description}</p>
											</div>
											<button
												onClick={() => addToCart(product)}
												className='w-full gradient-btn text-white font-semibold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer'
											>
												<ShoppingCart className='w-4 h-4' />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-3 transform -translate-y-1/2 p-2.5 rounded-full backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-200 z-30 cursor-pointer ${
							isStartDisabled ? "bg-white/5 text-slate-600 opacity-40 cursor-not-allowed" : "bg-slate-900/80 text-white hover:bg-violet-600 hover:border-violet-500/50"
						}`}
					>
						<ChevronLeft className='w-5 h-5' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-3 transform -translate-y-1/2 p-2.5 rounded-full backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-200 z-30 cursor-pointer ${
							isEndDisabled ? "bg-white/5 text-slate-600 opacity-40 cursor-not-allowed" : "bg-slate-900/80 text-white hover:bg-violet-600 hover:border-violet-500/50"
						}`}
					>
						<ChevronRight className='w-5 h-5' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;