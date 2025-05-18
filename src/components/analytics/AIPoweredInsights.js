"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react"

// Insights adaptés pour FootTickets
const INSIGHTS = [
  {
    icon: TrendingUp,
    color: "insight-icon-green",
    insight:
      "Les revenus sont en hausse de 15% par rapport au mois dernier, principalement grâce à la campagne promotionnelle pour le derby MC Alger vs CR Belouizdad.",
  },
  {
    icon: Users,
    color: "insight-icon-blue",
    insight:
      "La fidélisation des clients s'est améliorée de 8% suite au lancement du nouveau programme de fidélité pour les abonnés.",
  },
  {
    icon: ShoppingBag,
    color: "insight-icon-purple",
    insight:
      "Les matchs de la JS Kabylie montrent le plus fort potentiel de croissance des ventes basé sur les tendances récentes du marché.",
  },
  {
    icon: DollarSign,
    color: "insight-icon-yellow",
    insight:
      "L'optimisation de la stratégie de tarification pourrait potentiellement augmenter les marges bénéficiaires globales de 5 à 7%.",
  },
]

const AIPoweredInsights = () => {
  return (
    <motion.div
      className="ai-powered-insights"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <h2 className="ai-powered-insights-title">Insights Alimentés par l'IA</h2>
      <div className="ai-powered-insights-list">
        {INSIGHTS.map((item, index) => (
          <div key={index} className="ai-powered-insight">
            <div className={`ai-powered-insight-icon ${item.color}`}>
              <item.icon className={`ai-powered-insight-icon-svg ${item.color}`} />
            </div>
            <p className="ai-powered-insight-text">{item.insight}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default AIPoweredInsights
