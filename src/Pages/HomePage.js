import HeroCarousel from "../components/HeroCarousel"
import NewsCards from "../components/NewsCards"

function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <div className="news-section">
        <h2 className="news-title">Actualités de la Ligue</h2>
        <NewsCards />
      </div>
    </main>
  )
}

export default HomePage
