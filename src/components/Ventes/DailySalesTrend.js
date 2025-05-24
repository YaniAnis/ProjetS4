import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./sales.css";

// Agrège le total encaissé par jour (YYYY-MM-DD)
function aggregateSalesByDay(payments) {
	const map = {};
	payments.forEach((p) => {
		let date = null;
		if (p.created_at) {
			if (typeof p.created_at === "string" && /^\d{4}-\d{2}-\d{2}/.test(p.created_at)) {
				date = p.created_at.slice(0, 10);
			} else {
				try {
					const d = new Date(p.created_at);
					if (!isNaN(d.getTime())) {
						date = d.toISOString().slice(0, 10);
					}
				} catch {
					// fallback
				}
			}
		}
		if (!date) return;
		if (!map[date]) {
			map[date] = { day: date, sales: 0 };
		}
		let prix = 0;
		if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
		else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
		map[date].sales += prix;
	});
	return Object.values(map).sort((a, b) => a.day.localeCompare(b.day));
}

const DailySalesTrend = () => {
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				const res = await fetch("http://localhost:8000/api/payments");
				if (!res.ok) return;
				const contentType = res.headers.get("content-type");
				if (!contentType || !contentType.includes("application/json")) return;
				const data = await res.json();
				let payments = [];
				if (Array.isArray(data)) payments = data;
				else if (Array.isArray(data.data)) payments = data.data;
				else if (Array.isArray(data.paiements)) payments = data.paiements;
				else if (typeof data === "object") {
					const arr = Object.values(data).find((v) => Array.isArray(v));
					if (arr) payments = arr;
				}
				setDailySalesData(aggregateSalesByDay(payments));
			} catch {
				setDailySalesData([]);
			}
		};
		fetchPayments();
	}, []);

	return (
		<motion.div
			className='daily-sales-trend'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='daily-sales-title'>Total encaissé par jour</h2>
			<div className='daily-sales-container'>
				<ResponsiveContainer>
					<BarChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='day' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value) => [`${value} DZD`, "Total encaissé"]}
						/>
						<Bar dataKey='sales' fill='#10B981' name="Total encaissé" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default DailySalesTrend;
