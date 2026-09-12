import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();

	const { category } = useParams();

	useEffect(() => {
		if (category) {
			fetchProductsByCategory(category);
		}
	}, [fetchProductsByCategory, category]);

	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<motion.div
					className='text-center mb-12'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<span className='glow-pill mb-3 inline-flex text-xs font-semibold text-violet-300 uppercase tracking-widest'>
						Curated Collection
					</span>
					<h1 className='text-4xl sm:text-5xl font-black text-white tracking-tight'>
						{category ? category.charAt(0).toUpperCase() + category.slice(1) : "Category"}{" "}
						<span className='gradient-text'>Series</span>
					</h1>
					<p className='mt-2 text-sm text-slate-400 max-w-md mx-auto'>
						Explore our handpicked selection crafted with precision and modern elegance.
					</p>
				</motion.div>

				{loading ? (
					<LoadingSpinner />
				) : (
					<motion.div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{(!products || products.length === 0) && (
							<div className='col-span-full py-16 px-8 glass-panel rounded-3xl text-center max-w-md mx-auto shadow-2xl'>
								<h2 className='text-2xl font-black text-white mb-2'>
									No Products Found
								</h2>
								<p className='text-sm text-slate-400'>
									We currently don&apos;t have any products available in this category. Check back soon!
								</p>
							</div>
						)}

						{Array.isArray(products) && products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};
export default CategoryPage;