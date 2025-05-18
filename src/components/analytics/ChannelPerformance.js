"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Données adaptées pour FootTickets (canaux de vente)
const channelData = [
  { name: "Site web", value: 4000 },
  { name: "Application mobile", value: 3000 },
  { name: "Guichet", value: 2000 },
  { name: "Réseaux sociaux", value: 2780 },
  { name: "Partenaires", value: 1890 },
]

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"]

const ChannelPerformance = () => {
  return (
    <motion.div
      className="channel-performance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="channel-performance-title">Performance des Canaux de Vente</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {channelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} billets`, "Ventes"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e5e7eb",
              }}
              itemStyle={{ color: "#374151" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default ChannelPerformance
