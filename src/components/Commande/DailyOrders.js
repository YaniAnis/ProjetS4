import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Order.css";

// Agrège les paiements du jour courant par heure (HH)
function aggregatePaymentsByHourToday(payments) {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const map = {};
    payments.forEach((p) => {
        let date = null;
        if (p.created_at) {
            if (typeof p.created_at === "string" && /^\d{4}-\d{2}-\d{2}/.test(p.created_at)) {
                date = p.created_at.slice(0, 10);
            } else {
                try {
                    const d = new Date(p.created_at);
                    if (!isNaN(d.getTime())) {
                        date = d.toISOString().slice(0, 10);
                    }
                } catch {
                    // fallback
                }
            }
        }
        // Ignore si pas de date ou pas aujourd'hui
        if (!date || date !== today) return;

        // Récupère l'heure (HH)
        let hour = "00";
        if (p.created_at) {
            if (typeof p.created_at === "string" && p.created_at.length >= 13) {
                // Format "YYYY-MM-DDTHH:MM:SS" ou "YYYY-MM-DD HH:MM:SS"
                const match = p.created_at.match(/T?(\d{2}):/);
                if (match) {
                    hour = match[1];
                } else {
                    // fallback : coupe à l'index 11-13
                    hour = p.created_at.slice(11, 13);
                }
            } else {
                try {
                    const d = new Date(p.created_at);
                    if (!isNaN(d.getTime())) {
                        hour = d.getHours().toString().padStart(2, "0");
                    }
                } catch {
                    // fallback
                }
            }
        }

        if (!map[hour]) {
            map[hour] = { hour, orders: 0 };
        }
        map[hour].orders += 1;
    });
    // Trie par heure croissante (00 à 23)
    return Object.values(map).sort((a, b) => a.hour.localeCompare(b.hour));
}

// Agrège les paiements de la semaine courante par jour (YYYY-MM-DD)
function aggregatePaymentsByDayThisWeek(payments) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Trouve le lundi de la semaine courante
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    // Prépare les jours de la semaine (lundi à dimanche)
    const days = [];
    const dayMap = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date(firstDayOfWeek);
        d.setDate(firstDayOfWeek.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        days.push({ day: key, orders: 0 });
        dayMap[key] = days[days.length - 1];
    }
    payments.forEach((p) => {
        let date = null;
        if (p.created_at) {
            if (typeof p.created_at === "string" && /^\d{4}-\d{2}-\d{2}/.test(p.created_at)) {
                date = p.created_at.slice(0, 10);
            } else {
                try {
                    const d = new Date(p.created_at);
                    if (!isNaN(d.getTime())) {
                        date = d.toISOString().slice(0, 10);
                    }
                } catch {
                    // fallback
                }
            }
        }
        if (!date || !dayMap[date]) return;
        dayMap[date].orders += 1;
    });
    return days;
}

const DailyOrders = () => {
    const [dailyOrdersData, setDailyOrdersData] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/payments");
                if (!res.ok) {
                    setDailyOrdersData([]);
                    return;
                }
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    setDailyOrdersData([]);
                    return;
                }
                const data = await res.json();

                // Même logique que OrdersTable pour parser la réponse
                let payments = [];
                if (Array.isArray(data)) {
                    payments = data;
                } else if (Array.isArray(data.data)) {
                    payments = data.data;
                } else if (Array.isArray(data.paiements)) {
                    payments = data.paiements;
                } else if (typeof data === "object") {
                    const arr = Object.values(data).find((v) => Array.isArray(v));
                    if (arr) payments = arr;
                }

                // DEBUG: Affiche le nombre de paiements par jour de la semaine courante
                const grouped = aggregatePaymentsByDayThisWeek(payments);
                setDailyOrdersData(grouped);
            } catch (err) {
                setDailyOrdersData([]);
            }
        };
        fetchPayments();
    }, []);

    // Pour l'affichage, on veut des labels courts (Lun, Mar, ...)
    function getDayLabel(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString("fr-FR", { weekday: "short" });
    }

    return (
        <motion.div
            className="daily-orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="daily-orders-title">Paiements par jour (cette semaine)</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={dailyOrdersData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="day"
                            stroke="#9CA3AF"
                            label={{ value: "Jour", position: "insideBottomRight", offset: -5 }}
                            tickFormatter={getDayLabel}
                        />
                        <YAxis stroke="#9CA3AF" allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                            formatter={(value, name) =>
                                name === "orders"
                                    ? [`${value} paiements`, "Paiements"]
                                    : [value, name]
                            }
                            labelFormatter={getDayLabel}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            name="Paiements"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default DailyOrders;
