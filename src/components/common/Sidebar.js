import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart,  Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";

const SIDEBAR_ITEMS = [
    {
        name: "Aperçu",
        icon: BarChart2,
        color: "#6366f1",
        href: "/admin/overview",
    },
    { name: "Matches", icon: ShoppingBag, color: "#8B5CF6", href: "/admin/match" },
    { name: "Utilisateur", icon: Users, color: "#EC4899", href: "/admin/utilisateur" },
    { name: "Ventes", icon: DollarSign, color: "#10B981", href: "/admin/ventes" },
    { name: "Commande", icon: ShoppingCart, color: "#F59E0B", href: "/admin/commande" },
    { name: "Actualite", icon: Newspaper, color: "#F87171", href: "/admin/actualite" },
    { name: "Paramètre", icon: Settings, color: "#6EE7B7", href: "/admin/parametre" },

];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <motion.div
            className={`sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className="sidebar-container">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="menu-button"
                >
                    <Menu size={24} />
                </motion.button>

                <nav className="sidebar-nav">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className="sidebar-item">
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className="sidebar-item-text"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};
export default Sidebar;
