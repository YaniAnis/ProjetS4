import HeroCarousel from "../components/HeroCarousel"
import NewsCards from "../components/NewsCards"
import PlayerCarousel from "../Pages/PlayerCarousel" // Ajout de l'import

function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <div className="news-section">
        <h2 className="news-title">Actualités de la Ligue</h2>
        <NewsCards />
      </div>
      {/* Ajout du PlayerCarousel juste en dessous des actualités */}
      <PlayerCarousel />
    </main>
  )
}

export default HomePage
