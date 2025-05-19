import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/Matches/SalesTrendChart";
import ProductsTable from "../components/Matches/ProductsTable";
import AddMatch from "../components/Matches/AddMatch";
import "./Pages.css";

const MatchPage = () => {
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
					<StatCard name='Total Matches' icon={Package} value={45} color='#6366F1' />
					<StatCard name='Upcoming Matches' icon={TrendingUp} value={12} color='#10B981' />
					<StatCard name='Completed Matches' icon={AlertTriangle} value={33} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={"$123,456"} color='#EF4444' />
				</motion.div>

				{/* Add Match Form */}
				<AddMatch />

				<ProductsTable />

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