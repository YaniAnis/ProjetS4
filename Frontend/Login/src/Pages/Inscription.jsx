import React, { useState } from 'react';
import axios from 'axios';
import 'C:/Users/Ali/source/repos/ProjetS4/Front/my-react-app/src/App.css';
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Vérifier que les mots de passe correspondent
      if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas!");
        return;
      }

      // Envoyer les données au serveur
      await axios.post("https://localhost:5001/api/utilisateur/inscription", {
        nom: formData.lastName,
        prenom: formData.firstName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      
      alert("Compte créé avec succès !");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du compte.");
    }
  };

  return (
    <div b-ru0v5v9isa="" className="container">
        <main b-ru0v5v9isa="" role="main" className="pb-3">
            
<div className="auth-container">
    <div className="auth-card">
        
    <div className="auth-tabs">
        <a href="/Connexion" className="auth-tab ">Log in</a>
        <a href="/Inscription" className="auth-tab active">Register</a>
        </div>
    <div className="auth-content">
    <div className="row">
      <div className="col-md-4">
        <form id="registerForm" className="custom-register-form" onSubmit={handleSubmit}>
          <p className="form-title">Register</p>
          <p className="form-message">Signup now and get full access to our app.</p>

          <div className="form-flex">
            <div className="form-validation" role="alert"></div>

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

          <button id="registerSubmit" type="submit" className="form-submit">Register</button>
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