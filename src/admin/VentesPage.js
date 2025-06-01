import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../components/Ventes/SalesOverviewChart";
import DailySalesTrend from "../components/Ventes/DailySalesTrend";
import "./Pages.css";

// Synchronise les stats avec le backend
const VentesPage = () => {
	const [salesStats, setSalesStats] = useState({
		totalRevenue: "0 DZD",
		averageOrderValue: "0 DZD",
		conversionRate: "0%",
		salesGrowth: "0%",
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
				// Filtrer les paiements validés
				const validPayments = payments.filter((p) => p.statut === "validé");
				const totalRevenue = validPayments.reduce((sum, p) => {
					let prix = 0;
					if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
					else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
					return sum + prix;
				}, 0);

				const orderCount = validPayments.length;
				const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

				// Conversion rate: (nombre de paiements validés / nombre total de tentatives) * 100
				const totalAttempts = payments.length;
				const conversionRate = totalAttempts > 0 ? (orderCount / totalAttempts) * 100 : 0;

				// Sales growth: compare la somme du mois courant vs le mois précédent
				const now = new Date();
				const currentMonth = now.getMonth();
				const currentYear = now.getFullYear();
				const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
				const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

				const sumForMonth = (year, month) =>
					validPayments
						.filter((p) => {
							let dateStr = p.created_at || p.date || p.paid_at;
							if (!dateStr) return false;
							const d = new Date(dateStr);
							return d.getFullYear() === year && d.getMonth() === month;
						})
						.reduce((sum, p) => {
							let prix = 0;
							if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
							else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
							return sum + prix;
						}, 0);

				const revenueThisMonth = sumForMonth(currentYear, currentMonth);
				const revenuePrevMonth = sumForMonth(prevYear, prevMonth);
				let salesGrowth = 0;
				if (revenuePrevMonth > 0) {
					salesGrowth = ((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100;
				} else if (revenueThisMonth > 0) {
					salesGrowth = 100;
				}

				setSalesStats({
					totalRevenue: `${totalRevenue.toLocaleString("fr-FR")} DZD`,
					averageOrderValue: `${averageOrderValue.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} DZD`,
					conversionRate: `${conversionRate.toFixed(2)}%`,
					salesGrowth: `${salesGrowth.toFixed(1)}%`,
				});
			} catch {
				setSalesStats({
					totalRevenue: "0 DZD",
					averageOrderValue: "0 DZD",
					conversionRate: "0%",
					salesGrowth: "0%",
				});
			}
		};
		fetchStats();
	}, []);

	return (
		<div className='sales-page'>
			<Header title='Ventes' />

			<main className='sales-main'>
				{/* SALES STATS */}
				<motion.div
					className='sales-stats-grid'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Revenue' icon={DollarSign} value={salesStats.totalRevenue} color='#6366F1' />
					<StatCard
						name='Avg. Order Value'
						icon={ShoppingCart}
						value={salesStats.averageOrderValue}
						color='#10B981'
					/>
					<StatCard
						name='Conversion Rate'
						icon={TrendingUp}
						value={salesStats.conversionRate}
						color='#F59E0B'
					/>
					<StatCard name='Sales Growth' icon={CreditCard} value={salesStats.salesGrowth} color='#EF4444' />
				</motion.div>

				<SalesOverviewChart />

				<div className='sales-charts-grid'>
					<DailySalesTrend />
				</div>
			</main>
		</div>
	);
};
export default VentesPage;