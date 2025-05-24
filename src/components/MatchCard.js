import { useNavigate } from "react-router-dom"

function MatchCard({ match,darkMode }) {
  const navigate = useNavigate();

  // DEBUG: Affiche la structure complète du match et des zones AVANT tout calcul
  console.log("MatchCard match prop:", match);
  if (!Array.isArray(match.zones)) {
    console.warn("ATTENTION: match.zones est", match.zones, "pour le match id:", match.id);
  } else {
    console.log("Zones pour ce match:", match.zones);
  }

  // DEBUG: Affiche la structure complète des zones pour vérifier les clés
  if (Array.isArray(match.zones)) {
    console.log("Structure complète des zones:", match.zones);
    match.zones.forEach((z, i) => {
      console.log(`Zone ${i} keys:`, Object.keys(z));
    });
  }

  // Calcul du nombre total de places disponibles (clé dynamique)
  let totalPlaces = 0;
  let hasZones = Array.isArray(match.zones) && match.zones.length > 0;
  if (!hasZones) {
    // Affiche un message d'erreur clair si zones est undefined ou vide
    console.error(
      "Aucune donnée de zones reçue pour le match id:",
      match.id,
      "| match.zones =",
      match.zones,
      "| match complet =",
      match
    );
  } else {
    // Affiche la première zone pour voir la clé et sa valeur
    if (match.zones.length > 0) {
      console.log("Exemple de zone:", match.zones[0]);
    }
    const zoneValues = match.zones.map((z, i) => {
      // Affiche toutes les clés et valeurs de la zone pour debug
      console.log(`Zone ${i} structure:`, z);
      // Essaye toutes les clés possibles pour le nombre de places
      let raw = z.places;
      if (raw === undefined) raw = z.available;
      if (raw === undefined) raw = z.nbPlaces;
      if (raw === undefined) raw = z.nombre_places;
      if (raw === undefined) raw = z.nb_places;
      if (raw === undefined) raw = z.capacite;
      const val = Number(raw);
      console.log(`Zone ${i} (${z.name}): valeur brute=`, raw, "=> val comptée:", val);
      return !isNaN(val) && val >= 0 ? val : 0;
    });
    console.log("Valeurs des places par zone:", zoneValues, "Total attendu:", zoneValues.reduce((a, b) => a + b, 0));
    totalPlaces = zoneValues.reduce((sum, p) => sum + p, 0);
  }

  // DEBUG: Affiche le total des places calculé
  console.log("Total places calculé:", totalPlaces);

  // Calcul du prix minimum à partir des zones (si disponible)
  let minZonePrice = null;
  if (hasZones) {
    const prices = match.zones.map(z => Number(z.price)).filter(p => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      minZonePrice = Math.min(...prices);
    }
  }

  let priceDisplay = "Non disponible";
  if (minZonePrice !== null && !isNaN(minZonePrice) && minZonePrice > 0) {
    priceDisplay = `À partir de ${minZonePrice} DZD`;
  }
  let placesDisplay = "";
  if (hasZones && totalPlaces > 0) {
    placesDisplay = `${totalPlaces} places encore disponibles`;
  } else {
    placesDisplay = "Aucune place disponible";
  }

  const handleBuyTickets = () => {
    // Vérification login comme dans Navbar.js (isLoggedIn = isLoggedIn flag OU authToken/token présent)
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      !!localStorage.getItem("authToken") ||
      !!localStorage.getItem("token");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Vérification supplémentaire : user.email (optionnel, pour sécurité)
    let user = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        user = JSON.parse(userStr);
      }
    } catch {
      user = null;
    }
    if (
      user &&
      typeof user === "object" &&
      user.email &&
      typeof user.email === "string" &&
      user.email.trim() !== ""
    ) {
      // OK, utilisateur connecté avec email
    } else if (!isLoggedIn) {
      // déjà géré ci-dessus
      return;
    }
    // Autoriser tous les utilisateurs (admin inclus) à acheter des billets
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
          <div className="places">{placesDisplay}</div>
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
