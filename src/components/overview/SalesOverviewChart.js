import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./Overview.css";

// Helper to get month label in French
function getMonthLabel(date) {
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	return months[date.getMonth()];
}

// Aggregate validated payments per month for the last 12 months
function aggregateSalesByMonth(payments) {
	const now = new Date();
	const months = [];
	const monthMap = {};

	// Prepare last 12 months
	for (let i = 11; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		months.push({ key, label: getMonthLabel(d), sales: 0 });
		monthMap[key] = months[months.length - 1];
	}

	payments.forEach((p) => {
		if (p.statut !== "validé") return;
		let dateStr = p.created_at || p.date || p.paid_at;
		if (!dateStr) return;
		let d = new Date(dateStr);
		if (isNaN(d.getTime())) return;
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		if (monthMap[key]) {
			monthMap[key].sales += 1;
		}
	});

	return months;
}

const SalesOverviewChart = () => {
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
				setSalesData(aggregateSalesByMonth(payments));
			} catch {
				setSalesData([]);
			}
		};
		fetchPayments();
	}, []);

	return (
		<motion.div
			className='sales-overview-chart'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='sales-overview-title'>Aperçu des Ventes</h2>

			<div className='sales-overview-container'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"label"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value) => [`${value} ventes`, "Ventes"]}
						/>
						<Line
							type='monotone'
							dataKey='sales'
							stroke='#6366F1'
							strokeWidth={3}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;
