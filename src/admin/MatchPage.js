import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/Matches/SalesTrendChart";
import ProductsTable from "../components/Matches/ProductsTable";
import AddMatch from "../components/Matches/AddMatch";
import "./Pages.css";

const MatchPage = () => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [payments, setPayments] = useState([]);

	const fetchMatches = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8000/api/matches");
			const data = await res.json();
			setMatches(Array.isArray(data) ? data : data.data || []);
		} catch {
			setMatches([]);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		fetchMatches();
	}, [fetchMatches]);

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/payments");
				const data = await res.json();
				let paymentsArr = [];
				if (Array.isArray(data)) paymentsArr = data;
				else if (Array.isArray(data.data)) paymentsArr = data.data;
				else if (Array.isArray(data.paiements)) paymentsArr = data.paiements;
				else if (typeof data === "object") {
					const arr = Object.values(data).find((v) => Array.isArray(v));
					if (arr) paymentsArr = arr;
				}
				setPayments(paymentsArr);
			} catch {
				setPayments([]);
			}
		};
		fetchPayments();
	}, []);

	const handleMatchAdded = () => {
		fetchMatches();
	};

	const handleMatchDeleted = () => {
		fetchMatches();
	};

	// Calculs synchronisés
	const totalMatches = matches.length;
	const now = new Date();
	const completedMatches = matches.filter(m => {
		if (!m.date) return false;
		let matchDate;
		// Support both "YYYY-MM-DD" and "DD Month YYYY"
		if (/^\d{4}-\d{2}-\d{2}/.test(m.date)) {
			matchDate = new Date(m.date);
		} else {
			const parts = m.date.split(" ");
			if (parts.length === 3) {
				const [day, monthStr, year] = parts;
				const monthNames = {
					janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
					juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11
				};
				const month = monthNames[monthStr.toLowerCase()];
				if (month !== undefined) {
					matchDate = new Date(Number(year), month, Number(day));
				}
			}
		}
		if (!matchDate || isNaN(matchDate.getTime())) return false;
		const today = new Date();
		today.setHours(0,0,0,0);
		return matchDate < today;
	}).length;

	const upcomingMatches = matches.filter(m => {
		if (!m.date) return false;
		let matchDate;
		if (/^\d{4}-\d{2}-\d{2}/.test(m.date)) {
			matchDate = new Date(m.date);
		} else {
			const parts = m.date.split(" ");
			if (parts.length === 3) {
				const [day, monthStr, year] = parts;
				const monthNames = {
					janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
					juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11
				};
				const month = monthNames[monthStr.toLowerCase()];
				if (month !== undefined) {
					matchDate = new Date(Number(year), month, Number(day));
				}
			}
		}
		if (!matchDate || isNaN(matchDate.getTime())) return false;
		const today = new Date();
		today.setHours(0,0,0,0);
		return matchDate >= today;
	}).length;
	const totalRevenue = payments
		.filter(p => p.statut === "validé")
		.reduce((sum, p) => {
			let prix = 0;
			if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
			else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
			return sum + prix;
		}, 0);

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
					<StatCard name='Total Matches' icon={Package} value={totalMatches} color='#6366F1' />
					<StatCard name='Upcoming Matches' icon={TrendingUp} value={upcomingMatches} color='#10B981' />
					<StatCard name='Completed Matches' icon={AlertTriangle} value={completedMatches} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={`${totalRevenue.toLocaleString("fr-FR")} DZD`} color='#EF4444' />
				</motion.div>

				{/* Add Match Form */}
				<AddMatch onMatchAdded={handleMatchAdded} />

				<ProductsTable matches={matches} loading={loading} onMatchDeleted={handleMatchDeleted} />

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