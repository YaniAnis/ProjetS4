"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import "./Product.css"

// Données adaptées pour FootTickets
const salesData = [
  { date: "01/04", sales: 120 },
  { date: "02/04", sales: 145 },
  { date: "03/04", sales: 132 },
  { date: "04/04", sales: 167 },
  { date: "05/04", sales: 189 },
  { date: "06/04", sales: 212 },
  { date: "07/04", sales: 198 },
  { date: "08/04", sales: 225 },
  { date: "09/04", sales: 240 },
  { date: "10/04", sales: 268 },
  { date: "11/04", sales: 252 },
  { date: "12/04", sales: 284 },
  { date: "13/04", sales: 297 },
  { date: "14/04", sales: 310 },
]

const SalesTrendChart = () => {
  return (
    <motion.div
      className="sales-trend-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="sales-trend-title">Tendance des Ventes (14 derniers jours)</h2>
      <div className="sales-trend-container">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey={"date"} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default SalesTrendChart
