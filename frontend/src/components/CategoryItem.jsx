import { Link } from "react-router";

const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden h-[380px] w-full rounded-2xl group border border-white/10 hover:border-violet-500/40 shadow-xl shadow-black/40 transition-all duration-500'>
			<Link to={"/category" + category.href}>
				<div className='w-full h-full cursor-pointer relative'>
					<div className='absolute inset-0 bg-gradient-to-t from-[#08090f] via-[#08090f]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 z-10' />
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100'
						loading='lazy'
						onError={(e) => {
							e.currentTarget.onerror = null;
							e.currentTarget.src = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80";
						}}
					/>
					<div className='absolute bottom-0 left-0 right-0 p-6 z-20'>
						<span className='text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1.5 block'>Collection</span>
						<div className='flex items-center justify-between'>
							<h3 className='text-white text-2xl font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-300'>{category.name}</h3>
							<div className='w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300'>
								<span className='text-sm font-bold'>→</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;