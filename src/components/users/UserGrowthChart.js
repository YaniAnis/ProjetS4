import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import "./user.css";

function getLastMonths(n) {
	const months = [];
	const now = new Date();
	for (let i = n - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		months.push(d.toLocaleString('default', { month: 'short' }));
	}
	return months;
}

const UserGrowthChart = ({ latestUserCount }) => {
	const months = getLastMonths(6);
	const userGrowthData = months.map((month, idx) => ({
		month,
		users: idx === months.length - 1 ? latestUserCount : 0
	}));

	return (
		<motion.div
			className='user-growth-chart px-4 py-5 sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='user-growth-title'>User Growth</h2>
			<div className="mt-1 text-3xl font-semibold text-gray-100">
				{latestUserCount}
			</div>
			<div className='user-growth-container'>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart data={userGrowthData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='users'
							stroke='#8B5CF6'
							strokeWidth={2}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default UserGrowthChart;
