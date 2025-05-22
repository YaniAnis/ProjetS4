import { Navigate, Outlet } from "react-router-dom"

// List of admin emails (must match your LoginPage.js)
const ADMIN_EMAILS = ["admin@foottickets.com", "admin@admin.com"]

const AdminRoute = ({ children }) => {
  // Solution : ne jamais rediriger, toujours afficher le contenu enfant ou Outlet
  return children ? children : <Outlet />
}

export default AdminRoute


