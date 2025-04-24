import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import "./Pages.css";

const MatchPage = () => {
	return (
		<div className='products-page'>
			<Header title='Products' />

			<main className='products-main'>
				{/* STATS */}
				<motion.div
					className='products-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Products' icon={Package} value={1234} color='#6366F1' />
					<StatCard name='Top Selling' icon={TrendingUp} value={89} color='#10B981' />
					<StatCard name='Low Stock' icon={AlertTriangle} value={23} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={"$543,210"} color='#EF4444' />
				</motion.div>

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