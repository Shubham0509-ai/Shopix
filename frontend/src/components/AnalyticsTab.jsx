import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				const rawData = response.data?.data || response.data;
				if (rawData?.analyticsData) {
					setAnalyticsData(rawData.analyticsData);
				}
				if (Array.isArray(rawData?.dailySalesData)) {
					setDailySalesData(rawData.dailySalesData);
				}
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div className='text-center text-violet-400 py-12 text-sm font-semibold animate-pulse'>Loading analytics dashboard...</div>;
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={(analyticsData?.users ?? 0).toLocaleString()}
					icon={Users}
					badgeColor='text-violet-400'
					gradient='bg-gradient-to-br from-violet-600/20 via-indigo-900/10 to-transparent'
				/>
				<AnalyticsCard
					title='Total Products'
					value={(analyticsData?.products ?? 0).toLocaleString()}
					icon={Package}
					badgeColor='text-indigo-400'
					gradient='bg-gradient-to-br from-indigo-600/20 via-blue-900/10 to-transparent'
				/>
				<AnalyticsCard
					title='Total Orders'
					value={(analyticsData?.totalSales ?? 0).toLocaleString()}
					icon={ShoppingCart}
					badgeColor='text-cyan-400'
					gradient='bg-gradient-to-br from-cyan-600/20 via-teal-900/10 to-transparent'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${(analyticsData?.totalRevenue ?? 0).toLocaleString()}`}
					icon={DollarSign}
					badgeColor='text-fuchsia-400'
					gradient='bg-gradient-to-br from-fuchsia-600/20 via-rose-900/10 to-transparent'
				/>
			</div>
			<motion.div
				className='glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-white/10'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<h3 className='text-lg font-bold text-white mb-6'>Sales & Revenue Trends</h3>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.08)' />
						<XAxis dataKey='date' stroke='#94a3b8' fontSize={12} tickLine={false} />
						<YAxis yAxisId='left' stroke='#94a3b8' fontSize={12} tickLine={false} />
						<YAxis yAxisId='right' orientation='right' stroke='#94a3b8' fontSize={12} tickLine={false} />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(15, 17, 26, 0.9)",
								borderRadius: "16px",
								border: "1px solid rgba(255, 255, 255, 0.15)",
								boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
								color: "#fff",
							}}
						/>
						<Legend wrapperStyle={{ paddingTop: "12px" }} />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#8b5cf6'
							strokeWidth={2.5}
							dot={{ fill: "#8b5cf6", r: 4 }}
							activeDot={{ r: 7 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#38bdf8'
							strokeWidth={2.5}
							dot={{ fill: "#38bdf8", r: 4 }}
							activeDot={{ r: 7 }}
							name='Revenue ($)'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, badgeColor, gradient }) => (
	<motion.div
		className={`glass-panel rounded-3xl p-6 shadow-xl relative overflow-hidden border border-white/10 ${gradient}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-start'>
			<div className='z-10'>
				<p className={`text-xs uppercase tracking-wider mb-2 font-bold ${badgeColor}`}>{title}</p>
				<h3 className='text-white text-3xl font-black tracking-tight'>{value}</h3>
			</div>
			<div className={`p-3 rounded-2xl bg-white/5 border border-white/10 z-10 ${badgeColor}`}>
				<Icon className='h-6 w-6' />
			</div>
		</div>
		<div className='absolute -bottom-6 -right-6 opacity-10 pointer-events-none'>
			<Icon className='h-32 w-32 text-white' />
		</div>
	</motion.div>
);