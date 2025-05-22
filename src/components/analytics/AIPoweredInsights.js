import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

const INSIGHTS = [
    {
        icon: TrendingUp,
        color: "insight-icon-green",
        insight: "Revenue is up 15% compared to last month, driven primarily by a successful email campaign.",
    },
    {
        icon: Users,
        color: "insight-icon-blue",
        insight: "Customer retention has improved by 8% following the launch of the new loyalty program.",
    },
    {
        icon: ShoppingBag,
        color: "insight-icon-purple",
        insight: 'Product category "Electronics" shows the highest growth potential based on recent market trends.',
    },
    {
        icon: DollarSign,
        color: "insight-icon-yellow",
        insight: "Optimizing pricing strategy could potentially increase overall profit margins by 5-7%.",
    },
];

const AIPoweredInsights = () => {
    return (
        <motion.div
            className="ai-powered-insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
        >
            <h2 className="ai-powered-insights-title">AI-Powered Insights</h2>
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
    );
};
export default AIPoweredInsights;
