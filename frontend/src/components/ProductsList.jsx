import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const productList = Array.isArray(products) ? products : [];

	return (
		<motion.div
			className='glass-panel rounded-3xl overflow-hidden max-w-5xl mx-auto shadow-2xl shadow-black/40 border border-white/10'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-white/5 text-left'>
					<thead className='bg-white/5 border-b border-white/10'>
						<tr>
							<th scope='col' className='px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider'>
								Product
							</th>
							<th scope='col' className='px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider'>
								Price
							</th>
							<th scope='col' className='px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider'>
								Category
							</th>
							<th scope='col' className='px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider'>
								Featured
							</th>
							<th scope='col' className='px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-white/5'>
						{productList.length === 0 ? (
							<tr>
								<td colSpan='5' className='px-6 py-12 text-center text-slate-400 text-sm'>
									No products in catalog. Create one using the tab above.
								</td>
							</tr>
						) : (
							productList.map((product) => (
								<tr key={product._id} className='hover:bg-white/5 transition-colors'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center gap-3'>
											<div className='h-11 w-11 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-slate-900'>
												<img
													className='h-full w-full object-cover'
													src={product.image}
													alt={product.name}
													onError={(e) => {
														e.currentTarget.onerror = null;
														e.currentTarget.src = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80";
													}}
												/>
											</div>
											<div>
												<div className='text-sm font-bold text-white'>{product.name}</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm font-semibold text-white'>
											${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 capitalize'>
											{product.category}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<button
											onClick={() => toggleFeaturedProduct(product._id)}
											className={`p-2 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer ${
												product.isFeatured
													? "bg-amber-500/15 text-amber-400 border-amber-500/30"
													: "text-slate-500 hover:text-amber-300 bg-white/5"
											}`}
											title={product.isFeatured ? "Remove from featured" : "Set as featured"}
										>
											<Star className={`h-4 w-4 ${product.isFeatured ? "fill-amber-400" : ""}`} />
										</button>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<button
											onClick={() => deleteProduct(product._id)}
											className='text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer'
											title='Delete product'
										>
											<Trash className='h-4 w-4' />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default ProductsList;