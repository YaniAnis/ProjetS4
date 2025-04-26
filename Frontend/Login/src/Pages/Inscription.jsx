import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Changed to relative import

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Vérifier que les mots de passe correspondent
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas!");
        setLoading(false);
        return;
      }

      // Envoyer les données au serveur avec le bon mapping des champs
      const response = await axios.post(
        "https://localhost:5001/api/utilisateur/inscription",
        {
          nom: formData.lastName,         // Map lastName to nom
          prenom: formData.firstName,     // Map firstName to prenom
          email: formData.email,
          motDePasse: formData.password,  // Map password to motDePasse
          confirmMotDePasse: formData.confirmPassword // Map confirmPassword to confirmMotDePasse
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      alert("Compte créé avec succès !");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Redirect to login page
      window.location.href = "/Connexion";
    } catch (error) {
      console.error(error);
      
      if (error.response) {
        // The server responded with an error
        setError(error.response.data?.message || "Erreur lors de la création du compte.");
      } else if (error.request) {
        // The request was made but no response was received
        setError("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
      } else {
        // Something happened in setting up the request
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main role="main" className="pb-3">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-tabs">
              <a href="/Connexion" className="auth-tab">Log in</a>
              <a href="/Inscription" className="auth-tab active">Register</a>
            </div>
            <div className="auth-content">
              <div className="row">
                <div className="col-md-4">
                  <form id="registerForm" className="custom-register-form" onSubmit={handleSubmit}>
                    <p className="form-title">Register</p>
                    <p className="form-message">Signup now and get full access to our app.</p>

                    {error && (
                      <div className="form-validation alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <div className="form-flex">
                      <label className="form-label">
                        <input 
                          className="form-input" 
                          autoComplete="given-name" 
                          aria-required="true" 
                          required 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        <span className="input-label">Firstname</span>
                        <span className="form-validation"></span>
                      </label>

                      <label className="form-label">
                        <input 
                          className="form-input" 
                          autoComplete="family-name" 
                          aria-required="true" 
                          required 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        <span className="input-label">Lastname</span>
                        <span className="form-validation"></span>
                      </label>
                    </div>

                    <label className="form-label">
                      <input 
                        className="form-input" 
                        autoComplete="email" 
                        aria-required="true" 
                        required 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <span className="input-label">Email</span>
                      <span className="form-validation"></span>
                    </label>

                    <label className="form-label">
                      <input 
                        className="form-input" 
                        autoComplete="new-password" 
                        aria-required="true" 
                        required 
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <span className="input-label">Password</span>
                      <span className="form-validation"></span>
                    </label>

                    <label className="form-label">
                      <input 
                        className="form-input" 
                        autoComplete="new-password" 
                        aria-required="true" 
                        required 
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <span className="input-label">Confirm password</span>
                      <span className="form-validation"></span>
                    </label>

                    <button 
                      id="registerSubmit" 
                      type="submit" 
                      className="form-submit"
                      disabled={loading}
                    >
                      {loading ? "Inscription..." : "Register"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;