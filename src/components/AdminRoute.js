import { Navigate, Outlet } from "react-router-dom"

// List of admin emails (must match your LoginPage.js)
const ADMIN_EMAILS = ["admin@foottickets.com", "admin@admin.com"]

const AdminRoute = ({ children }) => {
  // TEMP: Autoriser l'accès admin si l'utilisateur est connecté (désactive la vérification d'email)
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  let isAdmin = false

  if (isLoggedIn) {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
      // Correction: vérifier que userInfo.email existe et est une string
      if (typeof userInfo.email === "string" && ADMIN_EMAILS.includes(userInfo.email.toLowerCase())) {
        isAdmin = true
      }
    } catch (e) {
      // Si parsing échoue, isAdmin reste false
    }
  }

  // Si l'utilisateur n'est pas admin, rediriger vers la page de connexion
  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  // Sinon, afficher le contenu protégé
  return children ? children : <Outlet />
}

export default AdminRoute