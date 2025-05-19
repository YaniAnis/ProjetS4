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
	const [actualities, setActualities] = useState([]);

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

	useEffect(() => {
		const fetchActualities = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/actualities");
				const data = await res.json();
				setActualities(Array.isArray(data) ? data : data.data || []);
			} catch {
				setActualities([]);
			}
		};
		fetchActualities();
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

				{/* Actualities Preview */}
				<div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
					<h3 className="text-lg font-semibold text-gray-100 mb-4">Actualités récentes</h3>
					<ul className="space-y-4">
						{actualities.slice(0, 3).map((a, idx) => (
							<li key={a.id || idx} className="border-b border-gray-700 pb-2">
								<div className="text-indigo-400 font-bold">{a.title}</div>
								<div className="text-gray-300">{a.content}</div>
							</li>
						))}
						{actualities.length === 0 && <li className="text-gray-400">Aucune actualité.</li>}
					</ul>
				</div>

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
