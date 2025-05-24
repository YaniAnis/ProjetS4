import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/Commande/DailyOrders";
import OrderDistribution from "../components/Commande/OrderDistribution";
import OrdersTable from "../components/Commande/OrdersTable";
import "./Pages.css";

// Synchronise les stats avec le backend
const CommandePage = () => {
	const [orderStats, setOrderStats] = useState({
		totalOrders: "0",
		pendingOrders: "0",
		completedOrders: "0",
		totalRevenue: "0 DZD",
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/payments");
				const data = await res.json();
				let payments = [];
				if (Array.isArray(data)) payments = data;
				else if (Array.isArray(data.data)) payments = data.data;
				else if (Array.isArray(data.paiements)) payments = data.paiements;
				else if (typeof data === "object") {
					const arr = Object.values(data).find((v) => Array.isArray(v));
					if (arr) payments = arr;
				}
				const totalOrders = payments.length;
				const completedOrders = payments.filter((p) => p.statut === "validé").length;
				const pendingOrders = payments.filter((p) => p.statut !== "validé").length;
				const totalRevenue = payments
					.filter((p) => p.statut === "validé")
					.reduce((sum, p) => {
						let prix = 0;
						if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
						else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
						return sum + prix;
					}, 0);

				setOrderStats({
					totalOrders: totalOrders.toLocaleString("fr-FR"),
					pendingOrders: pendingOrders.toLocaleString("fr-FR"),
					completedOrders: completedOrders.toLocaleString("fr-FR"),
					totalRevenue: `${totalRevenue.toLocaleString("fr-FR")} DZD`,
				});
			} catch {
				setOrderStats({
					totalOrders: "0",
					pendingOrders: "0",
					completedOrders: "0",
					totalRevenue: "0 DZD",
				});
			}
		};
		fetchStats();
	}, []);

	return (
		<div className='orders-page'>
			<Header title={"Commande"} />

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