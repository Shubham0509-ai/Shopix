import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" },
	{ href: "/shoes", name: "Shoes", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" },
	{ href: "/glasses", name: "Glasses", imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80" },
	{ href: "/jackets", name: "Jackets", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80" },
	{ href: "/suits", name: "Suits", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" },
	{ href: "/bags", name: "Bags", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, loading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white pb-20'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16'>
				{/* Hero Header */}
				<div className='text-center max-w-3xl mx-auto mb-16'>
					<div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glow-pill text-xs font-semibold uppercase tracking-wider mb-6'>
						<span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping' />
						Curated Luxury Collection • Autumn 2026
					</div>

					<h1 className='text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight'>
						Redefine Your <span className='gradient-text'>Everyday Style</span>
					</h1>
					<p className='text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed'>
						Explore handpicked essentials crafted with sustainable innovation, architectural silhouettes, and timeless aesthetics.
					</p>
				</div>

				{/* Categories Header */}
				<div className='flex items-center justify-between mb-8'>
					<div>
						<h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>Browse Categories</h2>
						<p className='text-slate-400 text-sm mt-1'>Find pieces that fit your unique aesthetic</p>
					</div>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!loading && products?.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;