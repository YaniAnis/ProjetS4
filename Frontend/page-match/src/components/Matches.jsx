"use client"

import { useState, useEffect } from "react"
import CalendarNavigation from "./CalendarNavigation"
import FilterBar from "./FilterBar"
import MatchCard from "./MatchCard"
import ActiveFilters from "./ActiveFilters"

// Fonction utilitaire pour retrouver le logo d'une équipe (à placer hors du useEffect)
function getTeamLogo(teamName) {
  const logos = {
    "USM Alger": "/logos/Ligue1/usm_alger.png",
    "JS Kabylie": "/logos/Ligue1/js_kabylie.png",
    "CR Belouizdad": "/logos/Ligue1/cr_belouizdad.png",
    "Paradou AC": "/logos/Ligue1/paradou_ac.png",
    "ES Sétif": "/logos/Ligue1/es_setif.png",
    "MC Alger": "/logos/Ligue1/mc_alger.png",
    "MC El Bayadh": "/logos/Ligue1/mc_elbayadh.png",
    "CS Constantine": "/logos/Ligue1/cs_constantine.png",
    "ASO Chlef": "/logos/Ligue1/aso_chlef.png",
    "JS Saoura": "/logos/Ligue1/js_saoura.png",
    "MC Oran": "/logos/Ligue1/mc_oran.png",
    "Olympique Akbou": "/logos/Ligue1/o_akbou.png",
    "USM Khenchela": "/logos/Ligue1/usm_khenchela.png",
    "US Biskra": "/logos/Ligue1/us_biskra.png",
    "NC Magra": "/logos/Ligue1/nc_magra.png",
    "ES Mostaganem": "/logos/Ligue1/es_mostaganem.png",
    // Ligue 2 Mobilis Est
    "AS Khroub": "/logos/Ligue2_Est/as_khroub.png",
    "CA Batna": "/logos/Ligue2_Est/ca_batna.png",
    "HB Chelghoum Laïd": "/logos/Ligue2_Est/hb_chelghoumlaid.png",
    "IB Khémis El Khechna": "/logos/Ligue2_Est/ib_khemiselkhechna.png",
    "IRB Ouargla": "/logos/Ligue2_Est/irb_ouargla.png",
    "JS Bordj Ménaïel": "/logos/Ligue2_Est/js_bordjmenaiel.png",
    "JS Djijel": "/logos/Ligue2_Est/js_djijel.png",
    "MO Constantine": "/logos/Ligue2_Est/mo_constantine.png",
    "MSP Batna": "/logos/Ligue2_Est/msp_batna.png",
    "NRB Teleghma": "/logos/Ligue2_Est/nrb_teleghma.png",
    "US Chaouia": "/logos/Ligue2_Est/us_chaouia.png",
    "US Souf": "/logos/Ligue2_Est/us_souf.png",
    "USM Annaba": "/logos/Ligue2_Est/usm_annaba.png",
    "USM El Harrach": "/logos/Ligue2_Est/usm_elharrach.png",
    "MB Rouissat": "/logos/Ligue2_Est/mb_rouissat.png",
    "Olympique Magrane": "/logos/Ligue2_Est/olympique_magrane.png",
    // Ligue 2 Mobilis Ouest
    "ASM Oran": "/logos/Ligue2_Ouest/asm_oran.png",
    "CR Témouchent": "/logos/Ligue2_Ouest/cr_temouchent.png",
    "ES Ben Aknoun": "/logos/Ligue2_Ouest/es_benaknoun.png",
    "ESM Koléa": "/logos/Ligue2_Ouest/esm_kolea.png",
    "GC Mascara": "/logos/Ligue2_Ouest/gc_mascara.png",
    "JS El Biar": "/logos/Ligue2_Ouest/js_elbiar.png",
    "JSM Tiaret": "/logos/Ligue2_Ouest/jsm_tiaret.png",
    "MC Saïda": "/logos/Ligue2_Ouest/mc_saida.png",
    "MCB Oued Sly": "/logos/Ligue2_Ouest/mcb_ouedsly.png",
    "NA Hussein Dey": "/logos/Ligue2_Ouest/na_husseindey.png",
    "RC Arbaâ": "/logos/Ligue2_Ouest/rc_arbaa.png",
    "RC Kouba": "/logos/Ligue2_Ouest/rc_kouba.png",
    "SC Mécheria": "/logos/Ligue2_Ouest/sc_mecheria.png",
    "SKAF Khemis Miliana": "/logos/Ligue2_Ouest/skaf_khemismiliana.png",
    "US Béchar Djedid": "/logos/Ligue2_Ouest/us_bechardjedid.png",
    "WA Mostaganem": "/logos/Ligue2_Ouest/wa_mostaganem.png",
  };
  return logos[teamName] || "/placeholder.svg";
}

function Matches() {
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [leagueFilter, setLeagueFilter] = useState("")
  const [selectedDate, setSelectedDate] = useState("all")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Fetch matches from backend
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/matches");
        const data = await res.json();
        // Ajoute ce log pour voir la structure brute
        console.log("Réponse brute API /api/matches :", data);

        // DEBUG: Affiche toutes les clés du premier objet reçu
        let firstMatch = null;
        if (Array.isArray(data) && data.length > 0) {
          firstMatch = data[0];
        } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          firstMatch = data.data[0];
        }
        if (firstMatch) {
          console.log("Premier match reçu:", firstMatch);
          for (const [key, value] of Object.entries(firstMatch)) {
            console.log(`Clé: ${key} | Valeur:`, value);
          }
        } else {
          console.log("Aucun match reçu ou structure inattendue.");
        }

        // Map backend fields to frontend model
        const mapped = (Array.isArray(data) ? data : data.data || []).map(m => {
          const homeName = m.homeTeam?.name || m.equipe1 || "";
          const awayName = m.awayTeam?.name || m.equipe2 || "";
          const homeLogo = getTeamLogo(homeName);
          const awayLogo = getTeamLogo(awayName);
          console.log("DEBUG LOGO:", homeName, "->", homeLogo, "|", awayName, "->", awayLogo);

          // Correction : si le logo n'est pas trouvé, log un avertissement
          if (!homeLogo || homeLogo === "/placeholder.svg") {
            console.warn("Logo introuvable pour équipe domicile:", homeName);
          }
          if (!awayLogo || awayLogo === "/placeholder.svg") {
            console.warn("Logo introuvable pour équipe extérieur:", awayName);
          }

          return {
            id: m.id,
            league: m.league,
            date: m.date,
            time: m.heure,
            homeTeam: {
              name: homeName,
              logo: homeLogo // toujours injecté, jamais ""
            },
            awayTeam: {
              name: awayName,
              logo: awayLogo // toujours injecté, jamais ""
            },
            stadium: m.stade?.nom || "",
            price: m.zones && m.zones.length > 0 ? Math.min(...m.zones.map(z => z.prix)) : "",
            zones: m.zones || [],
            // ...add more fields as needed
          };
        });

        setMatches(mapped);
        setFilteredMatches(mapped);
      } catch {
        setMatches([]);
        setFilteredMatches([]);
      }
    };
    fetchMatches();
  }, []);

  // Filtrer les matchs lorsque les filtres changent
  useEffect(() => {
    filterMatches()
  }, [searchTerm, leagueFilter, selectedDate, matches])

  // Fonction pour filtrer les matchs
  const filterMatches = () => {
    const filtered = matches.filter((match) => {
      // Filtrer par terme de recherche
      const matchesSearch =
        match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.stadium.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.league.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtrer par ligue
      const matchesLeague = leagueFilter === "" || match.league === leagueFilter

      // Filtrer par jour
      let matchesDay = true
      if (selectedDate !== "all") {
        // Convertir la date du match au format YYYY-MM-DD
        const dateParts = match.date.split(" ")
        const day = Number.parseInt(dateParts[0])

        // Convertir le mois en français en numéro de mois
        const monthNames = {
          janvier: "01",
          février: "02",
          mars: "03",
          avril: "04",
          mai: "05",
          juin: "06",
          juillet: "07",
          août: "08",
          septembre: "09",
          octobre: "10",
          novembre: "11",
          décembre: "12",
        }
        const month = monthNames[dateParts[1].toLowerCase()]
        const year = Number.parseInt(dateParts[2])

        const formattedDate = `${year}-${month}-${day < 10 ? "0" + day : day}`
        matchesDay = formattedDate === selectedDate
      }

      return matchesSearch && matchesLeague && matchesDay
    })

    setFilteredMatches(filtered)
  }

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchTerm("")
    setLeagueFilter("")
    setSelectedDate("all")
  }

  return (
    <section className="matches" id="matches-section">
      <div className="container">
        <h2>Matchs Disponibles</h2>

        <CalendarNavigation
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          matches={matches}
        />

        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          leagueFilter={leagueFilter}
          setLeagueFilter={setLeagueFilter}
        />

        <ActiveFilters
          searchTerm={searchTerm}
          leagueFilter={leagueFilter}
          selectedDate={selectedDate}
          setSearchTerm={setSearchTerm}
          setLeagueFilter={setLeagueFilter}
          setSelectedDate={setSelectedDate}
        />

        <div className="matches-grid" id="matches-container">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="no-matches" id="no-matches">
            <i className="fas fa-calendar-times"></i>
            <h3>Aucun match ne correspond à votre recherche</h3>
            <p>Essayez de modifier vos critères de recherche ou consultez d'autres dates.</p>
            <button id="reset-filters" className="btn-secondary" onClick={resetAllFilters}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Matches
