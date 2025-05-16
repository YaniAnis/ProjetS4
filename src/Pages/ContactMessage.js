function ContactMessage() {
    return (
      <main className="page-container">
        <h1 className="page-title">Contact</h1>
        <p className="page-description">Vous avez des questions ? N'hésitez pas à nous contacter.</p>
        <div className="page-content">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">
              Envoyer
            </button>
          </form>
        </div>
      </main>
    )
  }
  
  export default ContactMessage