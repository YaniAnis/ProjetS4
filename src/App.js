import { Routes, Route } from "react-router-dom"
import "./App.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./Pages/HomePage"
import MatchesPage from "./Pages/MatchesPage"
import TeamsPage from "./Pages/TeamsPage"
import NewsPage from "./Pages/NewsPage"
import ContactPage from "./Pages/ContactPage"
import NewsDetailPage from "./Pages/NewsDetailPage"
import LoginPage from "./Pages/LoginPage"
import RegisterPage from "./Pages/RegisterPage"
import ContactMessage from './Pages/ContactMessage';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/actualites/:id" element={<NewsDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Message" element={<ContactMessage />} />
        
      </Routes>
      <Footer />
    </div>
  )
}

export default App
