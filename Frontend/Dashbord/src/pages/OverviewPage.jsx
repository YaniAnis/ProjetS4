import {  ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import "./Pages.css";

const OverviewPage = () => {
	return (
		<div className='overview-page'>
			<Header title='Aperçu Général' />

			<main className='overview-main'>
				{/* STATS */}
				<motion.div
					className='overview-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Ventes Total' icon={Zap} value='$12,345' color='#6366F1' />
					<StatCard name='Nouveaux Utilisateur' icon={Users} value='1,234' color='#8B5CF6' />
					<StatCard name='Nombre de Matchs' icon={ShoppingBag} value='567' color='#EC4899' />
					
				</motion.div>

				{/* CHARTS */}
				<div className='overview-charts-grid'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
