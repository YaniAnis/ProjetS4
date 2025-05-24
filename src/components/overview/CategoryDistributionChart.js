import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

const CategoryDistributionChart = () => {
	const [clubData, setClubData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const matchesRes = await fetch("http://localhost:8000/api/matches");
				const matchesData = await matchesRes.json();
				const matches = Array.isArray(matchesData) ? matchesData : matchesData.data || [];

				// Compte le nombre de matchs où chaque club apparaît (domicile ou extérieur)
				const clubCount = {};
				matches.forEach((m) => {
					if (m.equipe1 && typeof m.equipe1 === "string" && m.equipe1.trim() !== "") {
						clubCount[m.equipe1] = (clubCount[m.equipe1] || 0) + 1;
					}
					if (m.equipe2 && typeof m.equipe2 === "string" && m.equipe2.trim() !== "") {
						clubCount[m.equipe2] = (clubCount[m.equipe2] || 0) + 1;
					}
				});
				const totalMatches = matches.length;
				const totalAppearances = totalMatches * 2; // 2 équipes par match

				// Format pour recharts (pourcentage de participation sur tous les slots possibles)
				const chartData = Object.entries(clubCount)
					.filter(([name]) => name && name.trim() !== "")
					.map(([name, value]) => ({
						name,
						value: totalAppearances > 0 ? (value / totalAppearances) * 100 : 0,
					}))
					.sort((a, b) => b.value - a.value)
					.slice(0, 10); // Limite à 10 clubs pour la lisibilité

				setClubData(chartData);
			} catch {
				setClubData([]);
			}
		};
		fetchData();
	}, []);

	return (
		<motion.div
			className="category-distribution-chart"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className="category-distribution-title">Distribution Par Clube</h2>
			<div className="category-distribution-container">
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={clubData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
							label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
						>
							{clubData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
							formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default CategoryDistributionChart;
