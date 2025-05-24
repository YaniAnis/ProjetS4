import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import "./Overview.css";

const COLORS = [
	"#6366F1",
	"#8B5CF6",
	"#EC4899",
	"#10B981",
	"#F59E0B",
	"#F87171",
	"#3B82F6",
	"#F59E42",
	"#22D3EE",
	"#F472B6",
	"#A3E635",
	"#FBBF24",
	"#FCA5A5",
	"#818CF8",
	"#FDE68A",
	"#FCD34D",
];

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

const SalesChannelChart = () => {
	const [monthData, setMonthData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const paymentsRes = await fetch("http://localhost:8000/api/payments");
				const paymentsData = await paymentsRes.json();
				let payments = [];
				if (Array.isArray(paymentsData)) payments = paymentsData;
				else if (Array.isArray(paymentsData.data)) payments = paymentsData.data;
				else if (Array.isArray(paymentsData.paiements)) payments = paymentsData.paiements;
				else if (typeof paymentsData === "object") {
					const arr = Object.values(paymentsData).find((v) => Array.isArray(v));
					if (arr) payments = arr;
				}
				setMonthData(aggregateRevenueByMonth(payments));
			} catch {
				setMonthData([]);
			}
		};
		fetchData();
	}, []);

	return (
		<motion.div
			className='sales-channel-chart'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='sales-channel-title'>Vente par Mois</h2>
			<div className='sales-channel-container'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<BarChart data={monthData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value) => [`${value} DZD`, "Revenu"]}
						/>
						<Legend />
						<Bar dataKey='sales' name='Revenu' fill='#8B5CF6'>
							{monthData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesChannelChart;
