import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { toast } from "react-hot-toast";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newProduct.image) {
			return toast.error("Please upload a product image", { id: "image-required" });
		}
		try {
			await createProduct(newProduct);
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
		} catch {
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};

	return (
		<motion.div
			className='glass-panel rounded-3xl p-8 mb-8 max-w-xl mx-auto shadow-2xl shadow-black/40 border border-white/10'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-black mb-6 text-white tracking-tight'>
				Create New <span className='gradient-text'>Product</span>
			</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='block w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm transition-all'
						placeholder='e.g. Cyberpunk Tech Jacket'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='block w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm transition-all'
						placeholder='Detailed description of the product...'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
						Price ($)
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='block w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm transition-all'
						placeholder='99.99'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='block w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm transition-all cursor-pointer'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category} className='bg-slate-900 text-white'>
								{category}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
						Product Image
					</label>
					<div className='flex items-center gap-3'>
						<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
						<label
							htmlFor='image'
							className='cursor-pointer bg-white/5 hover:bg-white/10 py-2.5 px-4 border border-white/10 rounded-xl text-sm font-semibold text-slate-200 hover:text-white transition-all focus:outline-none inline-flex items-center gap-2'
						>
							<Upload className='h-4 w-4' />
							Choose File
						</label>
						{newProduct.image && (
							<span className='text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full'>
								Image attached
							</span>
						)}
					</div>
				</div>

				<button
					type='submit'
					className='w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white gradient-btn shadow-lg shadow-violet-600/25 transition duration-200 cursor-pointer disabled:opacity-50 mt-6'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
							Creating product...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-4 w-4' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};
export default CreateProductForm;