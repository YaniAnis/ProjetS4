import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import "./Order.css";

const OrdersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Récupérer les paiements depuis l'API backend
        const fetchOrders = async () => {
            try {
                const apiUrl = "http://localhost:8000/api/payments";
                const res = await fetch(apiUrl);
                if (!res.ok) {
                    setOrders([]);
                    setFilteredOrders([]);
                    return;
                }
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    setOrders([]);
                    setFilteredOrders([]);
                    return;
                }
                let data = await res.json();

                // Affiche la structure pour debug
                console.log("API payments data:", data);

                // Force l'utilisation directe de data si c'est un tableau
                let payments = [];
                if (Array.isArray(data)) {
                    payments = data;
                } else if (data && typeof data === "object") {
                    // Si la réponse est un objet, affiche tous ses champs pour debug
                    Object.entries(data).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            console.log("Champ tableau trouvé :", key, value);
                        }
                    });
                    // Prend le premier tableau trouvé dans l'objet
                    const arr = Object.values(data).find((v) => Array.isArray(v));
                    if (arr) payments = arr;
                }

                // Si aucun paiement trouvé, affiche un log d'aide
                if (!payments.length) {
                    console.warn("Aucun paiement trouvé. Structure reçue :", data);
                }

                setOrders(payments);
                setFilteredOrders(payments);
            } catch (err) {
                setOrders([]);
                setFilteredOrders([]);
                console.error("Erreur lors de la récupération des paiements :", err);
            }
        };
        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = orders.filter(
            (order) =>
                (order.id && order.id.toString().toLowerCase().includes(term)) ||
                (order.user?.name && order.user.name.toLowerCase().includes(term)) ||
                (order.montant && order.montant.toString().toLowerCase().includes(term)) ||
                (order.ticket_id && order.ticket_id.toString().toLowerCase().includes(term))
        );
        setFilteredOrders(filtered);
    };

    return (
        <motion.div
            className="orders-table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className="orders-table-header">
                <h2 className="orders-table-title">Liste des Paiements</h2>
                <div className="orders-table-search">
                    <input
                        type="text"
                        placeholder="Rechercher un paiement..."
                        className="orders-table-search-input"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="orders-table-search-icon" size={18} />
                </div>
            </div>

            <div className="orders-table-container">
                <table className="orders-table-content">
                    <thead>
                        <tr>
                            <th>ID PAIEMENT</th>
                            <th>NOM</th>
                            <th>PRIX</th>
                            <th>ID TICKET</th>
                            <th>MODE DE PAIEMENT</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOrders.map((order) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td>{order.id}</td>
                                <td>{order.user?.name || "Admin"}</td>
                                <td>
                                    {order.ticket?.prix != null
                                        ? `${order.ticket.prix} DZD`
                                        : order.montant != null
                                            ? `${order.montant} DZD`
                                            : ""}
                                </td>
                                <td>{order.ticket_id}</td>
                                <td>{order.mode_paiement || "carte"}</td>
                                <td>
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleString("fr-FR")
                                        : ""}
                                </td>
                                <td>
                                    <span
                                        className={
                                            "status-badge " +
                                            (order.statut === "validé"
                                                ? "delivered"
                                                : "pending")
                                        }
                                    >
                                        {order.statut === "validé" ? "Validé" : "En attente"}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                                    Aucun paiement trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default OrdersTable;
