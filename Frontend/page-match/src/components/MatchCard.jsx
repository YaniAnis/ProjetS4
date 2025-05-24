function MatchCard({ match }) {
  // Correction : toujours utiliser le chemin relatif depuis public sans process.env.PUBLIC_URL
  // car dans React, /logos/... pointe déjà sur public/logos/...
  const homeLogo = typeof match.homeTeam?.logo === "string" && match.homeTeam.logo.trim() !== "" ? match.homeTeam.logo : "/placeholder.svg";
  const awayLogo = typeof match.awayTeam?.logo === "string" && match.awayTeam.logo.trim() !== "" ? match.awayTeam.logo : "/placeholder.svg";

  // DEBUG: Vérifie le chemin du logo et l'accessibilité du fichier
  console.log("homeLogo path:", homeLogo, "| awayLogo path:", awayLogo);

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
            <img src={homeLogo} alt={match.homeTeam.name} />
            <div className="team-name">{match.homeTeam.name}</div>
          </div>
          <div className="versus">VS</div>
          <div className="team">
            <img src={awayLogo} alt={match.awayTeam.name} />
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
