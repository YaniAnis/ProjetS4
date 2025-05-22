import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart,  Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Newspaper } from "lucide-react";
import React from "react";

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
    const [isAnimating, setIsAnimating] = useState(false);
    const location = useLocation();

    // Reset isAnimating if component unmounts during animation
    // (prevents stuck state on route change)
    React.useEffect(() => {
        return () => setIsAnimating(false);
    }, []);

    return (
        <motion.div
            className={`sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
        >
            <div className="sidebar-container" style={{ background: "#181f2a", color: "#fff", height: "100vh", padding: 0 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isSidebarOpen ? "center" : "flex-start",
                        height: 80,
                        borderBottom: "1px solid #232b3b",
                        marginBottom: 8,
                        width: "100%",
                        background: "transparent"
                    }}
                >
                    <span
                        style={{
                            fontWeight: 700,
                            fontSize: isSidebarOpen ? 28 : 0,
                            color: "#fff",
                            letterSpacing: 1,
                            transition: "font-size 0.2s",
                            opacity: isSidebarOpen ? 1 : 0,
                            whiteSpace: "nowrap"
                        }}
                    >
                        FooTiX
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            if (!isAnimating) setIsSidebarOpen((open) => !open);
                        }}
                        className="menu-button"
                        style={{
                            marginLeft: isSidebarOpen ? 16 : 0,
                            background: "none",
                            border: "none",
                            color: "#fff"
                        }}
                        disabled={isAnimating}
                        aria-disabled={isAnimating}
                    >
                        <Menu size={24} />
                    </motion.button>
                </div>
                <nav className="sidebar-nav">
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                style={{ textDecoration: "none", pointerEvents: isActive ? "none" : "auto" }}
                                tabIndex={isActive ? -1 : 0}
                            >
                                <motion.div
                                    className={`sidebar-item${isActive ? " active" : ""}`}
                                    style={{ color: "#fff" }}
                                >
                                    <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                className="sidebar-item-text"
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2, delay: 0.3 }}
                                                style={{ color: "#fff", marginLeft: 16, fontWeight: 500, fontSize: 16 }}
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </motion.div>
    );
};
export default Sidebar;
