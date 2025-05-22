import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/Matches/SalesTrendChart";
import ProductsTable from "../components/Matches/ProductsTable";
import AddMatch from "../components/Matches/AddMatch";
import "./Pages.css";

const MatchPage = () => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchMatches = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8000/api/matches");
			const data = await res.json();
			setMatches(Array.isArray(data) ? data : data.data || []);
		} catch {
			setMatches([]);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		fetchMatches();
	}, [fetchMatches]);

	const handleMatchAdded = () => {
		fetchMatches();
	};

	const handleMatchDeleted = () => {
		fetchMatches();
	};

	return (
		<div className='products-page'>
			<Header title='Matches' />

			<main className='products-main'>
				{/* STATS */}
				<motion.div
					className='products-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Matches' icon={Package} value={matches.length} color='#6366F1' />
					<StatCard name='Upcoming Matches' icon={TrendingUp} value={12} color='#10B981' />
					<StatCard name='Completed Matches' icon={AlertTriangle} value={33} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={"$123,456"} color='#EF4444' />
				</motion.div>

				{/* Add Match Form */}
				<AddMatch onMatchAdded={handleMatchAdded} />

				<ProductsTable matches={matches} loading={loading} onMatchDeleted={handleMatchDeleted} />

				{/* CHARTS */}
				<div className='products-charts-grid'>
					<SalesTrendChart />
					<CategoryDistributionChart />
				</div>
			</main>
		</div>
	);
};
export default MatchPage;