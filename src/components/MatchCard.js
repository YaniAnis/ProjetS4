import { useNavigate } from "react-router-dom"

function MatchCard({ match }) {
  const navigate = useNavigate();

  // Correction: Calculer le prix minimum à partir des zones (si disponible)
  let minZonePrice = null;
  if (Array.isArray(match.zones) && match.zones.length > 0) {
    const prices = match.zones
      .map(z => typeof z.price === "number" ? z.price : Number(z.price))
      .filter(p => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      minZonePrice = Math.min(...prices);
    }
  } else if (typeof match.price === "number" && !isNaN(match.price) && match.price > 0) {
    // fallback for legacy data
    minZonePrice = match.price;
  }

  let priceDisplay = "Non disponible";
  if (minZonePrice !== null && !isNaN(minZonePrice) && minZonePrice > 0) {
    priceDisplay = `À partir de ${minZonePrice} DZD`;
  }

  const handleBuyTickets = () => {
    // Pass match info and zones via state
    navigate("/tickets", {
      state: {
        matchId: match.id,
        homeTeam: match.homeTeam?.name,
        awayTeam: match.awayTeam?.name,
        stadium: match.stadium,
        league: match.league,
        date: match.date,
        time: match.time,
        homeLogo: match.homeTeam?.logo,
        awayLogo: match.awayTeam?.logo,
        zones: match.zones || [],
      }
    });
  };

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
          <div className="price">{priceDisplay}</div>
        </div>
        <button className="btn-primary" onClick={handleBuyTickets}>
          Acheter des billets
        </button>
      </div>
    </div>
  )
}

export default MatchCard
