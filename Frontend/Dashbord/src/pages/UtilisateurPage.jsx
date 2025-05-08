import { useEffect, useState } from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import "./Pages.css";

const UtilisateurPage = () => {

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

	// Calculate stats
	const today = new Date().toISOString().slice(0, 10);
	const totalUsers = users.length;
	const newUsersToday = users.filter(
		u => u.created_at && u.created_at.slice(0, 10) === today
	).length;
	const activeUsers = users.filter(
		u => !u.deleted_at
	).length;
	const deletedUsers = users.filter(
		u => u.deleted_at
	).length;
	const churnRate = totalUsers > 0 ? ((deletedUsers / totalUsers) * 100).toFixed(1) + "%" : "0%";

	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
		activeUsers: 0,
		churnRate: "0%",
	});
	
	const [filteredUsers, setFilteredUsers] = useState([]);

	useEffect(() => {
		// Fetch user statistics
		fetch("/api/user-stats")
			.then((response) => response.json())
			.then((data) => setUserStats(data))
			.catch((error) => console.error("Error fetching user stats:", error));

		// Fetch user data
		fetch("/api/users")
			.then((response) => response.json())
			.then((data) => {
				console.log("Fetched users:", data); // Debugging log
				setUsers(data);
				setFilteredUsers(data); // Initialize filtered users
			})
			.catch((error) => console.error("Error fetching users:", error));
	}, []);

	// Handle search
	const handleSearch = (searchTerm) => {
		const lowerCaseTerm = searchTerm.toLowerCase();
		const filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(lowerCaseTerm) ||
				user.email.toLowerCase().includes(lowerCaseTerm)
		);
		setFilteredUsers(filtered);
	};
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
								{formatNumber(totalUsers)}
							</span>
						}
						color='#6366F1'
					/>
					<StatCard
						name='New Users Today'
						icon={UserPlus}
						value={
							<span className="mt-1 text-3xl font-semibold text-gray-100">
								{formatNumber(newUsersToday)}
							</span>
						}
						color='#10B981'
					/>
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={
							<span className="mt-1 text-3xl font-semibold text-gray-100">
								{formatNumber(activeUsers)}
							</span>
						}
						color='#F59E0B'
					/>
					<StatCard
						name='Churn Rate'
						icon={UserX}
						value={
							<span className="mt-1 text-3xl font-semibold text-gray-100">
								{churnRate}
							</span>
						}
						color='#EF4444'
					/>
				</motion.div>

				{/* Pass filtered users and search handler to UsersTable */}
				<UsersTable users={filteredUsers} onSearch={handleSearch} />

				{/* USER CHARTS */}
				<div className='users-charts-grid'>
					<UserGrowthChart latestUserCount={users.length} />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div>
			</main>
		</div>
	);
};

export default UtilisateurPage;