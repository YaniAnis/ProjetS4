import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function MatchCard({ match,darkMode }) {
  const navigate = useNavigate();
  const [ticketsBought, setTicketsBought] = useState(0);
  const ticketLimit = 4;
  const [loading, setLoading] = useState(true);
  const [limitError, setLimitError] = useState(""); // Ajout pour message d'erreur

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

  // Nouvelle logique : vérifie en base le nombre de places achetées pour ce match par l'utilisateur
  useEffect(() => {
    let cancelled = false;
    async function fetchTicketsBought() {
      let user = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined" && userStr !== "null") {
          user = JSON.parse(userStr);
        }
      } catch {
        user = null;
      }
      if (!match?.id) {
        if (!cancelled) {
          setTicketsBought(0);
          setLoading(false);
        }
        return;
      }
      // Nouvelle logique : vérifie dans la liste des paiements (API /api/payments) par nom d'utilisateur et match.id
      if (user && user.name) {
        try {
          const res = await fetch("http://localhost:8000/api/payments");
          const data = await res.json();
          let payments = [];
          if (Array.isArray(data)) {
            payments = data;
          } else if (data && typeof data === "object") {
            const arr = Object.values(data).find((v) => Array.isArray(v));
            if (arr) payments = arr;
          }
          // Filtrer les paiements pour cet utilisateur et ce match
          const userPayments = payments.filter(
            p =>
              (p.user?.name && p.user.name === user.name) &&
              (p.ticket?.match_id && String(p.ticket.match_id) === String(match.id))
          );
          // Additionner le nombre de places pour ce match
          let totalPlaces = 0;
          userPayments.forEach(p => {
            if (typeof p.nb_places === "number") {
              totalPlaces += p.nb_places;
            } else if (p.ticket && p.ticket.numero_place) {
              const found = p.ticket.numero_place.match(/\((\d+)\)/g);
              if (found) {
                totalPlaces += found.map(s => parseInt(s.replace(/[^\d]/g, ""), 10)).reduce((a, b) => a + b, 0);
              } else {
                totalPlaces += 1;
              }
            } else {
              totalPlaces += 1;
            }
          });
          if (!cancelled) setTicketsBought(totalPlaces);
        } catch {
          if (!cancelled) setTicketsBought(0);
        }
      } else {
        if (!cancelled) setTicketsBought(0);
      }
      if (!cancelled) setLoading(false);
    }
    setLoading(true);
    fetchTicketsBought();
    return () => { cancelled = true; };
  }, [match?.id]); // <-- dépendance sur match.id uniquement

  const handleBuyTickets = async () => {
    setLimitError(""); // reset error
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      !!localStorage.getItem("authToken") ||
      !!localStorage.getItem("token");

    if (!isLoggedIn) {
      setLimitError("Vous devez être connecté pour acheter des billets.");
      return;
    }

    let user = null;
    try {
      // Accepte userInfo OU user (compatibilité avec tous les stockages)
      let userStr = localStorage.getItem("user");
      if ((!userStr || userStr === "undefined" || userStr === "null") && localStorage.getItem("userInfo")) {
        userStr = localStorage.getItem("userInfo");
      }
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        user = JSON.parse(userStr);
      }
    } catch {
      user = null;
    }
    // Accepte user.name OU user.email, même si l'un des deux est manquant
    if (
      !(
        user &&
        typeof user === "object" &&
        (
          (user.email && typeof user.email === "string" && user.email.trim() !== "") ||
          (user.name && typeof user.name === "string" && user.name.trim() !== "")
        )
      )
    ) {
      setLimitError("Erreur utilisateur : impossible de récupérer votre nom ou email. Vérifiez votre profil ou reconnectez-vous.");
      return;
    }

    // Vérifie la limite en base AVANT de permettre l'achat (toujours par nom d'utilisateur et match.id)
    let placesAchetees = 0;
    try {
      if (user && user.name) {
        const res = await fetch("http://localhost:8000/api/payments");
        if (!res.ok) {
          setLimitError("Erreur lors de la vérification de vos billets. Veuillez réessayer.");
          return;
        }
        const data = await res.json();
        let payments = [];
        if (Array.isArray(data)) {
          payments = data;
        } else if (data && typeof data === "object") {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          if (arr) payments = arr;
        }
        const userPayments = payments.filter(
          p =>
            (p.user?.name && p.user.name === user.name) &&
            (p.ticket?.match_id && String(p.ticket.match_id) === String(match.id))
        );
        userPayments.forEach(p => {
          if (typeof p.nb_places === "number") {
            placesAchetees += p.nb_places;
          } else if (p.ticket && p.ticket.numero_place) {
            const found = p.ticket.numero_place.match(/\((\d+)\)/g);
            if (found) {
              placesAchetees += found.map(s => parseInt(s.replace(/[^\d]/g, ""), 10)).reduce((a, b) => a + b, 0);
            } else {
              placesAchetees += 1;
            }
          } else {
            placesAchetees += 1;
          }
        });
      }
    } catch (err) {
      setLimitError("Erreur technique lors de la vérification de vos billets.");
      return;
    }

    if (placesAchetees >= ticketLimit) {
      setLimitError("Limite de places achetées atteinte pour ce match.");
      setTicketsBought(placesAchetees);
      return;
    }

    try {
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
          ticketsBought: placesAchetees,
          ticketLimit,
        }
      });
    } catch (err) {
      setLimitError("Erreur lors de la redirection vers la billeterie.");
    }
  };

  // DEBUG: Vérifie les chemins des logos pour ce match
  console.log("homeTeam.logo =", match.homeTeam?.logo, "| awayTeam.logo =", match.awayTeam?.logo);
  console.log("match.homeTeam =", match.homeTeam);
  console.log("match.awayTeam =", match.awayTeam);

  // Ajoute un warning explicite si le logo est vide
  if (!match.homeTeam?.logo || match.homeTeam.logo.trim() === "") {
    console.warn(
      "Le logo de l'équipe à domicile est vide pour",
      match.homeTeam?.name,
      ". Vérifiez le mapping dans le composant parent (ex: Matches.jsx) : il doit fournir un chemin d'image valide via getTeamLogo(nomEquipe)."
    );
  }
  if (!match.awayTeam?.logo || match.awayTeam.logo.trim() === "") {
    console.warn(
      "Le logo de l'équipe à l'extérieur est vide pour",
      match.awayTeam?.name,
      ". Vérifiez le mapping dans le composant parent (ex: Matches.jsx) : il doit fournir un chemin d'image valide via getTeamLogo(nomEquipe)."
    );
  }

  // Correction : si logo est vide ici, c'est que le mapping dans Matches.jsx ne trouve pas le chemin du logo.
  // Solution : dans Matches.jsx, adapte le mapping comme ceci :
  // homeTeam: { name: m.homeTeam?.name || m.equipe1 || "", logo: getTeamLogo(m.homeTeam?.name || m.equipe1 || "") }
  // awayTeam: { name: m.awayTeam?.name || m.equipe2 || "", logo: getTeamLogo(m.awayTeam?.name || m.equipe2 || "") }
  // et assure-toi que getTeamLogo reçoit bien le nom exact (ex : "JS Kabylie").

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
            {/* Correction : vérifie que le logo est bien une string non vide, sinon fallback */}
            <img
              src={typeof match.homeTeam?.logo === "string" && match.homeTeam.logo.trim() !== "" ? match.homeTeam.logo : "/placeholder.svg"}
              alt={match.homeTeam?.name || ""}
              style={{ width: 60, height: 60, objectFit: "contain", marginBottom: 10 }}
            />
            <div className="team-name">{match.homeTeam?.name || ""}</div>
          </div>
          <div className="versus">VS</div>
          <div className="team">
            <img
              src={typeof match.awayTeam?.logo === "string" && match.awayTeam.logo.trim() !== "" ? match.awayTeam.logo : "/placeholder.svg"}
              alt={match.awayTeam?.name || ""}
              style={{ width: 60, height: 60, objectFit: "contain", marginBottom: 10 }}
            />
            <div className="team-name">{match.awayTeam?.name || ""}</div>
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
        {loading ? (
          <button className="btn-primary" disabled>Chargement...</button>
        ) : ticketsBought >= ticketLimit ? (
          <>
            <button className="btn-primary" disabled style={{ background: "#ccc", cursor: "not-allowed" }}>
              Limite de billets atteinte
            </button>
            <div style={{ color: "red", marginTop: 8, fontWeight: 500 }}>
              Vous avez déjà acheté 4 places pour ce match.
            </div>
          </>
        ) : (
          <button className="btn-primary" onClick={handleBuyTickets}>
            Acheter des billets
          </button>
        )}
        {limitError && (
          <div style={{ color: "red", marginTop: 8, fontWeight: 500 }}>{limitError}</div>
        )}
      </div>
    </div>
  )
}

export default MatchCard
