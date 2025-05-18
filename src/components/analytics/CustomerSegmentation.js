"use client"

import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts"

// Données adaptées pour FootTickets (segmentation des supporters)
const supporterSegmentationData = [
  { subject: "Engagement", A: 120, B: 110, fullMark: 150 },
  { subject: "Fidélité", A: 98, B: 130, fullMark: 150 },
  { subject: "Satisfaction", A: 86, B: 130, fullMark: 150 },
  { subject: "Dépenses", A: 99, B: 100, fullMark: 150 },
  { subject: "Fréquence", A: 85, B: 90, fullMark: 150 },
  { subject: "Récence", A: 65, B: 85, fullMark: 150 },
]

const CustomerSegmentation = () => {
  return (
    <motion.div
      className="customer-segmentation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2 className="customer-segmentation-title">Segmentation des Supporters</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={supporterSegmentationData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#6b7280" />
            <Radar name="Supporters occasionnels" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} />
            <Radar name="Supporters réguliers" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#e5e7eb",
              }}
              itemStyle={{ color: "#374151" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default CustomerSegmentation
