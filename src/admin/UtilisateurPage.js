import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import "./Pages.css";

const UtilisateurPage = () => {
	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
		activeUsers: 0,
		churnRate: "0%",
	});

	useEffect(() => {
		const fetchUserStats = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/user-stats");
				const stats = await response.json();
				setUserStats({
					totalUsers: stats.totalUsers ?? 0,
					newUsersToday: stats.newUsersToday ?? 0,
					activeUsers: stats.activeUsers ?? 0,
					churnRate: stats.churnRate ?? "0%",
				});
			} catch (e) {
				setUserStats({
					totalUsers: 0,
					newUsersToday: 0,
					activeUsers: 0,
					churnRate: "0%",
				});
			}
		};
		fetchUserStats();
	}, []);

	const formatNumber = (num) =>
		num.toLocaleString("fr-FR").replace(/,/g, " ").replace(/\s/g, " ");

	return (
		<div className='users-page'>
			<Header title='Utilisateur' />

			<main className='users-main'>
				{/* STATS */}
				<motion.div
					className='users-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={
							<span className="mt-1 text-3xl font-semibold text-gray-100">
								{formatNumber(userStats.totalUsers)}
							</span>
						}
						color='#6366F1'
					/>
					<StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={formatNumber(userStats.activeUsers)}
						color='#F59E0B'
					/>
					<StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' />
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				<div className='users-charts-grid'>
					<UserGrowthChart latestUserCount={userStats.totalUsers} />
					<UserActivityHeatmap />
					{/* <UserDemographicsChart /> */}
				</div>
			</main>
		</div>
	);
};
export default UtilisateurPage;