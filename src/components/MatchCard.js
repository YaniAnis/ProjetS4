function MatchCard({ match }) {
  return (
    <div className="match-card">
      <div className="match-header">
        <div className="league">{match.league}</div>
        <div className="date">
          {match.date} - {match.time}
        </div>
      </div>
      <div className="match-content">
        <div className="teams">
          <div className="team">
            <img src={match.homeTeam.logo || "/placeholder.svg"} alt={match.homeTeam.name} />
            <div className="team-name">{match.homeTeam.name}</div>
          </div>
          <div className="versus">VS</div>
          <div className="team">
            <img src={match.awayTeam.logo || "/placeholder.svg"} alt={match.awayTeam.name} />
            <div className="team-name">{match.awayTeam.name}</div>
          </div>
        </div>
        <div className="match-details">
          <div className="stadium">
            <i className="fas fa-map-marker-alt"></i>
            <span>{match.stadium}</span>
          </div>
          <div className="price">À partir de {match.price}€</div>
        </div>
        <a href={`/purchase?id=${match.id}`} className="btn-primary">
          Acheter des billets
        </a>
      </div>
    </div>
  )
}

export default MatchCard
