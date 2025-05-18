import { Navigate, Outlet } from "react-router-dom"

const AdminRoute = ({ children }) => {
  // Vérifier si l'utilisateur est connecté et a le rôle admin
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const userRole = localStorage.getItem("userRole")
  const isAdmin = isLoggedIn && userRole === "admin"

  // Si l'utilisateur n'est pas admin, rediriger vers la page de connexion
  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  // Sinon, afficher le contenu protégé
  return children ? children : <Outlet />
}

export default AdminRoute


