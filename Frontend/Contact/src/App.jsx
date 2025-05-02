import React from 'react';
import './App.css';
import { Search, ChevronRight, Mail } from 'lucide-react';

function App() {
  return (
    <main className="help-page">
      {/* Stadium Background Image */}
      <div className="stadium-background">
        <img src="/stadium-background.png" alt="Stadium" className="stadium-image" />
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
              <Search className="search-icon" />
            </button>
          </div>

          {/* Search Examples */}
          <div className="search-examples">
            <span className="examples-label">Search examples :</span>
            <button className="example-button">Buy ticket</button>
            <button className="example-button">Change bank information</button>
            <button className="example-button">Ticketplace</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-grid">
          {/* Left Column - Information of the Moment */}
          <div className="info-column">
            <h2 className="section-title">INFORMATIONS OF THE MOMENT</h2>

            <div className="faq-list">
              {/* FAQ Items */}
              <div className="faq-item dark">
                <h3 className="faq-title">Travel Ban for OM-PSG Match</h3>
                <ChevronRight className="chevron-icon" />
              </div>
              <div className="faq-item dark">
                <h3 className="faq-title">How can I buy tickets for a match at the Parc des Princes?</h3>
                <ChevronRight className="chevron-icon" />
              </div>
              <div className="faq-item dark">
                <h3 className="faq-title">Can I visit the Parc des Princes?</h3>
                <ChevronRight className="chevron-icon" />
              </div>
              <div className="faq-item dark">
                <h3 className="faq-title">How to regulate my subscription</h3>
                <ChevronRight className="chevron-icon" />
              </div>
            </div>
          </div>

          {/* Right Column - Email Contact */}
          <div className="email-column">
            <div className="email-content">
              <div className="email-icon-container">
                <Mail className="email-icon" />
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
  );
}

export default App;