import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Footix</h1>
      </div>

      <div className="navbar-links">
        <a href="#" className="nav-link">
          Match
        </a>
        <a href="#" className="nav-link">
          Classement
        </a>
        <a href="#" className="nav-link">
          Actualités
        </a>
      </div>

      <div className="navbar-auth">
        <span className="login-text">Login</span>
      </div>
    </nav>
  )
}

export default Navbar
