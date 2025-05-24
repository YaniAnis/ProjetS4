import ContactForm from "./ContactForm.js"
import "./ContactPage.css"

function ContactPage() {
  return (
    <main className="contact-page">
      {/* Section Hero avec image en arrière-plan */}
      <div className="hero-section">
        <div className="hero-background">
          <img src="/images/Contact/stadee.avif" alt="Stade de football" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="contact-title">Contactez-nous</h1>
          <p className="contact-subtitle">Une question sur vos tickets ? Notre équipe est là pour vous aider !</p>
        </div>
      </div>

      {/* Section formulaire */}
      <div className="contact-container">
        <div className="contact-content">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}

export default ContactPage