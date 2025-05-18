"use client"

import { motion } from "framer-motion"
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react"

const overviewData = [
  {
    name: "Revenus",
    value: "1 234 567 DA",
    change: 12.5,
    icon: DollarSign,
  },
  {
    name: "Utilisateurs",
    value: "45 678",
    change: 8.3,
    icon: Users,
  },
  {
    name: "Commandes",
    value: "9 876",
    change: -3.2,
    icon: ShoppingBag,
  },
  {
    name: "Vues de page",
    value: "1 234 567",
    change: 15.7,
    icon: Eye,
  },
]

const OverviewCards = () => {
  return (
    <div className="overview-cards">
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="overview-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="overview-card-header">
            <div>
              <h3 className="overview-card-title">{item.name}</h3>
              <p className="overview-card-value">{item.value}</p>
            </div>
            <div className={`overview-card-icon-container ${item.change >= 0 ? "positive" : "negative"}`}>
              <item.icon className={`overview-card-icon ${item.change >= 0 ? "positive" : "negative"}`} />
            </div>
          </div>
          <div className={`overview-card-change ${item.change >= 0 ? "positive" : "negative"}`}>
            {item.change >= 0 ? <ArrowUpRight size="20" /> : <ArrowDownRight size="20" />}
            <span className="overview-card-change-value">{Math.abs(item.change)}%</span>
            <span className="overview-card-change-label">vs période précédente</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default OverviewCards
