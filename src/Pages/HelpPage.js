import "./HelpPage.css"

function HelpPage() {
  return (
    <main className="help-page">
      {/* Stadium Background Image */}
      <div className="stadium-background">
        <img src="/images/stadium-background.png" alt="Stadium" className="stadium-image" />
        <div className="overlay"></div>
      </div>

      {/* Content Container */}
      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="main-title">NEED HELP ?</h1>

          {/* Search Bar */}
          <div className="search-container">
            <input type="text" placeholder="Enter a keyword or a question" className="search-input" />
            <button className="search-button">
              {/* Search icon SVG inline */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="search-icon"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* Search Examples */}
          <div className="search-examples">
            <span className="examples-label">Search examples :</span>
            <button className="example-button">achat ticket</button>
            <button className="example-button">informations banquaires érronées</button>
            <button className="example-button">dernier délai</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-grid">
          {/* Left Column - Information of the Moment */}
          <div className="info-column">
            <h2 className="section-title">INFORMATIONS DU MOMENT</h2>

            <div className="faq-list">
              {/* FAQ Items */}
              <div className="faq-item dark">
                <h3 className="faq-title">je veux rembourser mon billet comment faire ? </h3>
                {/* Chevron icon SVG inline */}
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
                  className="chevron-icon"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="faq-item dark">
                <h3 className="faq-title">comment achter un billets pour un match au Nelson Mandela?</h3>
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
                  className="chevron-icon"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="faq-item dark">
                <h3 className="faq-title">pourrai-je visister le stade Hocine Ait Ahmed ?</h3>
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
                  className="chevron-icon"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="faq-item dark">
                <h3 className="faq-title">comment confirmer ma suscription ?</h3>
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
                  className="chevron-icon"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column - Email Contact */}
          <div className="email-column">
            <div className="email-content">
              <div className="email-icon-container">
                {/* Mail icon SVG inline */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="email-icon"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h2 className="email-title">EMAIL</h2>
              <p className="email-description">
                Vous n'avez pas trouvé la réponse à votre question ? Contactez notre équipe de support.
              </p>
              <button className="contact-button">Contacter</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HelpPage

