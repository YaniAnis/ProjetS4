import HeroCarousel from "../components/HeroCarousel"
import NewsCards from "../components/NewsCards"
import PlayerCarousel from "../Pages/PlayerCarousel" // Ajout de l'import

function HomePage({ darkMode }) {
  return (
    <main>
      <HeroCarousel />
      <div className="news-section">
        <h2 className="news-title">Actualités de la Ligue</h2>
        <NewsCards limit={3} /> {/* Pass the limit prop */}
      </div>
      <div className="player-section">
        <PlayerCarousel darkMode={darkMode} />
      </div>
    </main>
  )
}

export default HomePage
