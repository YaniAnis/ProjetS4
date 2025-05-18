"use client"

import { motion } from "framer-motion"

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
      <div className="stat-card-content">
        <span className="stat-card-name">
          <Icon size={20} className="stat-card-icon" style={{ color }} />
          {name}
        </span>
        <p className="stat-card-value">{value}</p>
      </div>
    </motion.div>
  )
}

export default StatCard
