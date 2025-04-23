import React, { useState } from 'react';
import axios from 'axios';
import 'C:/Users/Ali/source/repos/ProjetS4/Front/my-react-app/src/App.css';


const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    MotDePasse: '',
    rememberMe: false
  });
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://localhost:5001/api/utilisateur/connexion', {
        email: credentials.email,
        motDePasse: credentials.MotDePasse
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      alert(`Bienvenue !`);
      
      if (credentials.rememberMe && res.data.token) {
        localStorage.setItem('userToken', res.data.token);
      }


    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Email ou mot de passe incorrect.";
      alert(errorMessage);
    }
  };

  return (
    <div className="container">
      <main role="main" className="pb-3">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-tabs">
              <a href="/Connexion" className="auth-tab active">Log in</a> {/* Made active */}
              <a href="/Inscription" className="auth-tab">Register</a>
            </div>
            <div className="auth-content">
              <div className="row">
                <div className="col-md-4">
                  <section>
                    <form id="account" onSubmit={handleSubmit} className="custom-login-form">
                      <h2 className="form-title">Welcome back</h2>
                      <p className="form-message">Log in to access your account</p>

                      <div className="form-validation" role="alert"></div>

                      <label className="form-label">
                        <input 
                          className="form-input" 
                          autoComplete="username" 
                          aria-required="true" 
                          required 
                          name="email"
                          type="email"
                          value={credentials.email}
                          onChange={handleChange}
                        />
                        <span className="input-label">Email</span>
                        <span className="form-validation"></span>
                      </label>

                      <label className="form-label">
                        <input 
                          className="form-input" 
                          autoComplete="current-password" 
                          aria-required="true" 
                          required 
                          name="MotDePasse"
                          type="password"
                          value={credentials.MotDePasse}
                          onChange={handleChange}
                        />
                        <span className="input-label">Password</span>
                        <span className="form-validation"></span>
                      </label>

                      <div className="form-checkbox">
                        <input 
                          className="form-check-input" 
                          name="rememberMe" 
                          type="checkbox" 
                          checked={credentials.rememberMe}
                          onChange={handleChange}
                        />
                        <label className="form-label">
                          Remember me
                        </label>
                      </div>

                      <button id="login-submit" type="submit" className="form-submit">Log in</button>

                      <div className="form-links">
                        <a id="forgot-password" href="./ForgotPassword">Forgot your password?</a>
                        <a id="resend-confirmation" href="./ResendEmailConfirmation">Resend email confirmation</a>
                      </div>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;