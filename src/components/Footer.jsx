import "./Footer.css"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="copyright">© {currentYear} Footix. Tous droits réservés.</p>
        </div>

        <div className="footer-section">
          <ul className="footer-links">
            <li>
              <a href="#">Mentions légales</a>
            </li>
            <li>
              <a href="#">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
