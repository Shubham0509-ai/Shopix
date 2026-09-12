import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-12'>
				<motion.div
					className='text-center mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<span className='glow-pill mb-3 inline-flex text-xs font-semibold text-violet-300 uppercase tracking-widest'>
						Management Suite
					</span>
					<h1 className='text-4xl font-black text-white tracking-tight'>
						Admin <span className='gradient-text'>Dashboard</span>
					</h1>
					<p className='mt-2 text-sm text-slate-400'>
						Manage products, inventory catalog, and real-time revenue analytics
					</p>
				</motion.div>

				<div className='flex flex-wrap justify-center gap-3 mb-10'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
								activeTab === tab.id
									? "gradient-btn text-white shadow-lg shadow-violet-600/25"
									: "glass-panel text-slate-400 hover:text-white hover:bg-white/10"
							}`}
						>
							<tab.icon className='mr-2 h-4 w-4' />
							{tab.label}
						</button>
					))}
				</div>
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList />}
				{activeTab === "analytics" && <AnalyticsTab />}
			</div>
		</div>
	);
};
export default AdminPage;