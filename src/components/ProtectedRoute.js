import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  // Vérifier si l'utilisateur est connecté
  if (!isLoggedIn) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" replace />
  }

  // Si l'utilisateur est connecté, afficher les composants enfants
  return <Outlet />
}

export default ProtectedRoute
