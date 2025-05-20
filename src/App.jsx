import Navbar from "./components/Navbar"
import TeamPage from "./components/TeamPage"
import Footer from "./components/Footer"
import "./myapp.css"

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <TeamPage />
      </main>
      <Footer />
    </div>
  )
}

export default App
