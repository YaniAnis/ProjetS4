import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import "./Product.css";

// Helper to get month label (e.g. "Jan", "Feb", ...)
function getMonthLabel(date) {
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	return months[date.getMonth()];
}

// Aggregate validated payments per month for the last 12 months (sum of prices)
function aggregateRevenueByMonth(payments) {
	const now = new Date();
	const months = [];
	const monthMap = {};
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		months.push({ key, month: getMonthLabel(d), sales: 0 });
		monthMap[key] = months[months.length - 1];
	}
	payments.forEach((p) => {
		if (p.statut !== "validé") return;
		let dateStr = p.created_at || p.date || p.paid_at;
		if (!dateStr) return;
		let d = new Date(dateStr);
		if (isNaN(d.getTime())) return;
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		let prix = 0;
		if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
		else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
		if (monthMap[key]) {
			monthMap[key].sales += prix;
		}
	});
	return months;
}

const SalesTrendChart = () => {
	const [salesData, setSalesData] = useState([]);

	useEffect(() => {
		const fetchPayments = async () => {
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
				setSalesData(aggregateRevenueByMonth(payments));
			} catch {
				setSalesData([]);
			}
		};
		fetchPayments();
	}, []);

	return (
		<motion.div
			className='sales-trend-chart'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='sales-trend-title'>Vente</h2>
			<div className='sales-trend-container'>
				<ResponsiveContainer>
					<LineChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value) => [`${value} DZD`, "Vente"]}
						/>
						<Legend />
						<Line type='monotone' dataKey='sales' stroke='#8B5CF6' strokeWidth={2} name="Vente" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesTrendChart;
