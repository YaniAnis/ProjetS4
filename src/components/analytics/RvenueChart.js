"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Données adaptées pour FootTickets
const revenueData = [
  { month: "Jan", revenue: 400000, target: 380000 },
  { month: "Fév", revenue: 300000, target: 320000 },
  { month: "Mar", revenue: 500000, target: 450000 },
  { month: "Avr", revenue: 450000, target: 420000 },
  { month: "Mai", revenue: 600000, target: 550000 },
  { month: "Juin", revenue: 550000, target: 580000 },
  { month: "Juil", revenue: 700000, target: 650000 },
]

const RevenueChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Ce mois")

  // Formater les valeurs en DA
  const formatCurrency = (value) => {
    return `${value.toLocaleString()} DA`
  }

  return (
    <motion.div
      className="revenue-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="revenue-chart-header">
        <h2 className="revenue-chart-title">Revenus vs Objectifs</h2>
        <select
          className="revenue-chart-select"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>Cette semaine</option>
          <option>Ce mois</option>
          <option>Ce trimestre</option>
          <option>Cette année</option>
        </select>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: "white", borderColor: "#e5e7eb" }}
              itemStyle={{ color: "#374151" }}
            />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} />
            <Area type="monotone" dataKey="target" name="Objectifs" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default RevenueChart
