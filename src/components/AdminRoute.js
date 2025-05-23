import { Navigate, Outlet } from "react-router-dom"

// List of admin emails (must match your LoginPage.js)
// const ADMIN_EMAILS = ["admin@foottickets.com", "admin@admin.com"]

const AdminRoute = ({ children }) => {
  // Accept both string and boolean true for isLoggedIn
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" ||
    localStorage.getItem("isLoggedIn") === true ||
    !!localStorage.getItem("userToken");

  let isAdmin = false;

  let userInfoRaw = localStorage.getItem("userInfo");
  let userInfo = {};
  if (userInfoRaw && typeof userInfoRaw === "string") {
    try {
      userInfo = JSON.parse(userInfoRaw);
    } catch (e) {
      // If parsing fails, userInfo stays {}
    }
  }

  // Accept admin if role is "admin" (case-insensitive, trimmed)
  if (
    isLoggedIn &&
    userInfo &&
    typeof userInfo === "object" &&
    typeof userInfo.role === "string" &&
    userInfo.role.trim().toLowerCase() === "admin"
  ) {
    isAdmin = true;
  }

  // Correction: if you are admin, always render children or <Outlet />
  if (isAdmin) {
    return children ? children : <Outlet />;
  }

  // If not admin, redirect to login
  return <Navigate to="/login" replace />;
}

export default AdminRoute