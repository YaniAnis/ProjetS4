import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/Commande/DailyOrders";
import OrderDistribution from "../components/Commande/OrderDistribution";
import OrdersTable from "../components/Commande/OrdersTable";
import "./Pages.css";

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const CommandePage = () => {
	return (
		<div className='orders-page'>
			<Header title={"Orders"} />

			<main className='orders-main'>
				<motion.div
					className='orders-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
					<StatCard
						name='Completed Orders'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='orders-charts-grid'>
					<DailyOrders />
					<OrderDistribution />
				</div>

				<OrdersTable />
			</main>
		</div>
	);
};
export default CommandePage;