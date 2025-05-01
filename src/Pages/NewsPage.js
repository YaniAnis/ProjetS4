import NewsCards from "../components/NewsCards"

function NewsPage() {
  return (
    <main className="page-container">
      <h1 className="page-title">Actualités</h1>
      <p className="page-description">Restez informé des dernières actualités du monde du football.</p>

      <div className="page-content">
        <NewsCards />
      </div>
    </main>
  )
}

export default NewsPage

  