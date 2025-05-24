import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import "./sales.css";

// Helper to get day label (e.g. "Lun", "Mar", ...)
function getDayLabel(date) {
	const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
	return days[date.getDay()];
}

// Helper to get month label (e.g. "Jan", "Feb", ...)
function getMonthLabel(date) {
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	return months[date.getMonth()];
}

// Helper to get week label (e.g. "Semaine 12")
function getWeekLabel(date) {
	const firstJan = new Date(date.getFullYear(), 0, 1);
	const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
	return "S" + (Math.ceil((days + firstJan.getDay() + 1) / 7));
}

// 7 derniers jours (This Week)
function aggregateRevenueByDay(payments) {
	const now = new Date();
	const days = [];
	const dayMap = {};
	for (let i = 6; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(now.getDate() - i);
		const key = d.toISOString().slice(0, 10);
		days.push({ key, day: getDayLabel(d), sales: 0 });
		dayMap[key] = days[days.length - 1];
	}
	payments.forEach((p) => {
		if (p.statut !== "validé") return;
		let dateStr = p.created_at || p.date || p.paid_at;
		if (!dateStr) return;
		let d = new Date(dateStr);
		if (isNaN(d.getTime())) return;
		const key = d.toISOString().slice(0, 10);
		let prix = 0;
		if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
		else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
		if (dayMap[key]) {
			dayMap[key].sales += prix;
		}
	});
	return days;
}

// 4 dernières semaines (This Month)
function aggregateRevenueByWeek(payments) {
	const now = new Date();
	const weeks = [];
	const weekMap = {};
	for (let i = 3; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(now.getDate() - i * 7);
		const year = d.getFullYear();
		const week = getWeekLabel(d);
		const key = `${year}-W${week}`;
		weeks.push({ key, week, sales: 0 });
		weekMap[key] = weeks[weeks.length - 1];
	}
	payments.forEach((p) => {
		if (p.statut !== "validé") return;
		let dateStr = p.created_at || p.date || p.paid_at;
		if (!dateStr) return;
		let d = new Date(dateStr);
		if (isNaN(d.getTime())) return;
		const year = d.getFullYear();
		const week = getWeekLabel(d);
		const key = `${year}-W${week}`;
		let prix = 0;
		if (p.ticket && p.ticket.prix != null && !isNaN(Number(p.ticket.prix))) prix = Number(p.ticket.prix);
		else if (p.montant != null && !isNaN(Number(p.montant))) prix = Number(p.montant);
		if (weekMap[key]) {
			weekMap[key].sales += prix;
		}
	});
	return weeks;
}

// 3 derniers mois (This Quarter)
function aggregateRevenueByQuarterMonth(payments) {
	const now = new Date();
	const months = [];
	const monthMap = {};
	for (let i = 2; i >= 0; i--) {
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

// 12 derniers mois (This Year)
function aggregateRevenueByYearMonth(payments) {
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

const SalesOverviewChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
	const [payments, setPayments] = useState([]);
	const [chartData, setChartData] = useState([]);
	const [xKey, setXKey] = useState("month");

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

	useEffect(() => {
		let data = [];
		let xKeyVal = "month";
		if (selectedTimeRange === "This Week") {
			data = aggregateRevenueByDay(payments);
			xKeyVal = "day";
		} else if (selectedTimeRange === "This Month") {
			data = aggregateRevenueByWeek(payments);
			xKeyVal = "week";
		} else if (selectedTimeRange === "This Quarter") {
			data = aggregateRevenueByQuarterMonth(payments);
			xKeyVal = "month";
		} else if (selectedTimeRange === "This Year") {
			data = aggregateRevenueByYearMonth(payments);
			xKeyVal = "month";
		}
		setChartData(data);
		setXKey(xKeyVal);
	}, [payments, selectedTimeRange]);

	return (
		<motion.div
			className='sales-overview-chart'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='sales-overview-header'>
				<h2 className='sales-overview-title'>Sales Overview</h2>

				<select
					className='sales-overview-select'
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>This Week</option>
					<option>This Month</option>
					<option>This Quarter</option>
					<option>This Year</option>
				</select>
			</div>

			<div className='sales-overview-container'>
				<ResponsiveContainer>
					<AreaChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey={xKey} stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value) => [`${value} DZD`, "Revenu"]}
						/>
						<Area type='monotone' dataKey='sales' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;
