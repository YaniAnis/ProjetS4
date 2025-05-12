import "./Navbar.css"

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <a href="/" className="navbar-logo">
              FOOTIX
            </a>
            <nav className="navbar-nav">
              <a href="/matches" className="navbar-link">
                Matches
              </a>
              <a href="/teams" className="navbar-link">
                Teams
              </a>
              <a href="/tickets" className="navbar-link">
                Tickets
              </a>
              <a href="/about" className="navbar-link">
                About
              </a>
            </nav>
          </div>
          <div className="navbar-right">
            <button className="icon-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            <button className="icon-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="sign-in-button">Sign In</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
