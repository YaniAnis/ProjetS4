"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

const userRetentionData = [
  { name: "Semaine 1", retention: 100 },
  { name: "Semaine 2", retention: 75 },
  { name: "Semaine 3", retention: 60 },
  { name: "Semaine 4", retention: 50 },
  { name: "Semaine 5", retention: 45 },
  { name: "Semaine 6", retention: 40 },
  { name: "Semaine 7", retention: 38 },
  { name: "Semaine 8", retention: 35 },
]

const UserRetention = () => {
  return (
    <motion.div
      className="user-retention"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="user-retention-title">Rétention des Utilisateurs</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={userRetentionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value) => [`${value}%`, "Taux de rétention"]}
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e5e7eb",
              }}
              itemStyle={{ color: "#374151" }}
            />
            <Legend />
            <Line type="monotone" dataKey="retention" name="Taux de rétention" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default UserRetention
