import {  ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import "./Pages.css";

const OverviewPage = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/users");
				const data = await response.json();
				const usersArray = Array.isArray(data) ? data : data.data || [];
				setUsers(usersArray);
			} catch (e) {
				setUsers([]);
			}
		};
		fetchUsers();
	}, []);

	const formatNumber = (num) =>
		num.toLocaleString("fr-FR").replace(/,/g, " ").replace(/\s/g, " ");

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
					<StatCard
						name='Nouveaux Utilisateur'
						icon={Users}
						value={
							<span className="mt-1 text-3xl font-semibold text-gray-100">
								{formatNumber(users.length)}
							</span>
						}
						color='#8B5CF6'
					/>
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
