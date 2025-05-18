"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"

// Données adaptées pour FootTickets (performances des matchs)
const matchPerformanceData = [
  { name: "MC Alger vs CR Belouizdad", ventes: 4000, revenus: 240000, profit: 120000 },
  { name: "JS Kabylie vs USM Alger", ventes: 3000, revenus: 180000, profit: 90000 },
  { name: "Paradou AC vs ES Sétif", ventes: 2000, revenus: 120000, profit: 60000 },
  { name: "MC Oran vs CS Constantine", ventes: 2780, revenus: 166800, profit: 83400 },
  { name: "USM Khenchela vs ASO Chlef", ventes: 1890, revenus: 113400, profit: 56700 },
]

const ProductPerformance = () => {
  // Formater les valeurs en DA
  const formatCurrency = (value) => {
    return `${value.toLocaleString()} DA`
  }

  return (
    <motion.div
      className="product-performance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="product-performance-title">Performance des Matchs</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={matchPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "ventes") return value
                return formatCurrency(value)
              }}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e5e7eb",
              }}
              itemStyle={{ color: "#374151" }}
            />
            <Legend />
            <Bar dataKey="ventes" name="Billets vendus" fill="#16a34a" />
            <Bar dataKey="revenus" name="Revenus" fill="#3b82f6" />
            <Bar dataKey="profit" name="Profit" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default ProductPerformance
