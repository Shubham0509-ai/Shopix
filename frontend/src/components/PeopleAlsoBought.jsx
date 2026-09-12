import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				const data = res.data?.data || res.data || [];
				setRecommendations(Array.isArray(data) ? data : []);
			} catch (error) {
				const message = error.response?.data?.message || "An error occurred while fetching recommendations";
				toast.error(message, { id: message });
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='mt-10 pt-8 border-t border-white/10'>
			<h3 className='text-2xl font-black text-white tracking-tight'>
				People Also <span className='gradient-text'>Bought</span>
			</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{Array.isArray(recommendations) && recommendations.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};
export default PeopleAlsoBought;