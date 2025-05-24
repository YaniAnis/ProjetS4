"use client"

import { useState, useEffect } from "react"
import CalendarNavigation from "./CalendarNavigation"
import FilterBar from "./FilterBar"
import MatchCard from "./MatchCard"
import ActiveFilters from "./ActiveFilters"

function Matches({ darkMode }) {
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [leagueFilter, setLeagueFilter] = useState("")
  const [selectedDate, setSelectedDate] = useState("all")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Fetch matches from backend
  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/matches");
      const data = await res.json();

      // Club name to logo mapping
      const clubLogo = (name) => {
        if (!name) return "";
        const basePath = "/logos";
        const l1 = {
          "USM Alger": `${basePath}/Ligue1/usm_alger.png`,
          "JS Kabylie": `${basePath}/Ligue1/js_kabylie.png`,
          "CR Belouizdad": `${basePath}/Ligue1/cr_belouizdad.png`,
          "Paradou AC": `${basePath}/Ligue1/paradou_ac.png`,
          "ES Sétif": `${basePath}/Ligue1/es_setif.png`,
          "MC Alger": `${basePath}/Ligue1/mc_alger.png`,
          "MC El Bayadh": `${basePath}/Ligue1/mc_elbayadh.png`,
          "CS Constantine": `${basePath}/Ligue1/cs_constantine.png`,
          "ASO Chlef": `${basePath}/Ligue1/aso_chlef.png`,
          "JS Saoura": `${basePath}/Ligue1/js_saoura.png`,
          "MC Oran": `${basePath}/Ligue1/mc_oran.png`,
          "Olympique Akbou": `${basePath}/Ligue1/o_akbou.png`,
          "USM Khenchela": `${basePath}/Ligue1/usm_khenchela.png`,
          "US Biskra": `${basePath}/Ligue1/us_biskra.png`,
          "NC Magra": `${basePath}/Ligue1/nc_magra.png`,
          "ES Mostaganem": `${basePath}/Ligue1/es_mostaganem.png`,
        };
        const l2e = {
          "AS Khroub": `${basePath}/Ligue2_Est/as_khroub.png`,
          "CA Batna": `${basePath}/Ligue2_Est/ca_batna.png`,
          "HB Chelghoum Laïd": `${basePath}/Ligue2_Est/hb_chelghoumlaid.png`,
          "IB Khémis El Khechna": `${basePath}/Ligue2_Est/ib_khemiselkhechna.png`,
          "IRB Ouargla": `${basePath}/Ligue2_Est/irb_ouargla.png`,
          "JS Bordj Ménaïel": `${basePath}/Ligue2_Est/js_bordjmenaiel.png`,
          "JS Djijel": `${basePath}/Ligue2_Est/js_djijel.png`,
          "MO Constantine": `${basePath}/Ligue2_Est/mo_constantine.png`,
          "MSP Batna": `${basePath}/Ligue2_Est/msp_batna.png`,
          "NRB Teleghma": `${basePath}/Ligue2_Est/nrb_teleghma.png`,
          "US Chaouia": `${basePath}/Ligue2_Est/us_chaouia.png`,
          "US Souf": `${basePath}/Ligue2_Est/us_souf.png`,
          "USM Annaba": `${basePath}/Ligue2_Est/usm_annaba.png`,
          "USM El Harrach": `${basePath}/Ligue2_Est/usm_elharrach.png`,
          "MB Rouissat": `${basePath}/Ligue2_Est/mb_rouissat.png`,
          "Olympique Magrane": `${basePath}/Ligue2_Est/olympique_magrane.png`,
        };
        const l2o = {
          "ASM Oran": `${basePath}/Ligue2_Ouest/asm_oran.png`,
          "CR Témouchent": `${basePath}/Ligue2_Ouest/cr_temouchent.png`,
          "ES Ben Aknoun": `${basePath}/Ligue2_Ouest/es_benaknoun.png`,
          "ESM Koléa": `${basePath}/Ligue2_Ouest/esm_kolea.png`,
          "GC Mascara": `${basePath}/Ligue2_Ouest/gc_mascara.png`,
          "JS El Biar": `${basePath}/Ligue2_Ouest/js_elbiar.png`,
          "JSM Tiaret": `${basePath}/Ligue2_Ouest/jsm_tiaret.png`,
          "MC Saïda": `${basePath}/Ligue2_Ouest/mc_saida.png`,
          "MCB Oued Sly": `${basePath}/Ligue2_Ouest/mcb_ouedsly.png`,
          "NA Hussein Dey": `${basePath}/Ligue2_Ouest/na_husseindey.png`,
          "RC Arbaâ": `${basePath}/Ligue2_Ouest/rc_arbaa.png`,
          "RC Kouba": `${basePath}/Ligue2_Ouest/rc_kouba.png`,
          "SC Mécheria": `${basePath}/Ligue2_Ouest/sc_mecheria.png`,
          "SKAF Khemis Miliana": `${basePath}/Ligue2_Ouest/skaf_khemismiliana.png`,
          "US Béchar Djedid": `${basePath}/Ligue2_Ouest/us_bechardjedid.png`,
          "WA Mostaganem": `${basePath}/Ligue2_Ouest/wa_mostaganem.png`,
        };
        return l1[name] || l2e[name] || l2o[name] || "/placeholder.svg";
      };

      // Map backend fields to frontend model
      const mapped = (Array.isArray(data) ? data : data.data || []).map(m => ({
        id: m.id,
        league: m.league,
        date: m.date,
        time: m.heure,
        homeTeam: {
          name: m.equipe1,
          logo: clubLogo(m.equipe1) // Ensure logo is mapped correctly
        },
        awayTeam: {
          name: m.equipe2,
          logo: clubLogo(m.equipe2) // Ensure logo is mapped correctly
        },
        stadium: m.stade?.nom || "",
        price: m.zones && m.zones.length > 0 ? Math.min(...m.zones.map(z => z.prix)) : "",
        zones: m.zones || [],
      }))
      // Filtrer les matchs dont la date est passée
      .filter(match => {
        if (!match.date) return false;
        // On suppose que match.date est au format "DD Month YYYY" ou "YYYY-MM-DD"
        let matchDate;
        if (/^\d{4}-\d{2}-\d{2}/.test(match.date)) {
          matchDate = new Date(match.date);
        } else {
          // Format "DD Month YYYY"
          const parts = match.date.split(" ");
          if (parts.length === 3) {
            const [day, monthStr, year] = parts;
            const monthNames = {
              janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
              juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11
            };
            const month = monthNames[monthStr.toLowerCase()];
            if (month !== undefined) {
              matchDate = new Date(Number(year), month, Number(day));
            }
          }
        }
        if (!matchDate || isNaN(matchDate.getTime())) return false;
        // On ne garde que les matchs dont la date n'est pas passée (>= aujourd'hui)
        const today = new Date();
        today.setHours(0,0,0,0);
        return matchDate >= today;
      });

      setMatches(mapped);
      setFilteredMatches(mapped);
    } catch {
      setMatches([]);
      setFilteredMatches([]);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filtrer les matchs lorsque les filtres changent
  useEffect(() => {
    filterMatches()
  }, [searchTerm, leagueFilter, selectedDate, matches])

  // Fonction pour filtrer les matchs
  const filterMatches = () => {
    if (!matches || !Array.isArray(matches)) {
      setFilteredMatches([]);
      return;
    }

    const filtered = matches.filter((match) => {
      if (!match || typeof match !== 'object') return false;

      const safeToString = v => (typeof v === "string" ? v : "");
      const homeName = safeToString(match.homeTeam?.name);
      const awayName = safeToString(match.awayTeam?.name);
      const stadium = safeToString(match.stadium);
      const league = safeToString(match.league);
      const searchTermLower = safeToString(searchTerm).toLowerCase();

      let matchesSearch = false;
      try {
        matchesSearch =
          homeName.toLowerCase().includes(searchTermLower) ||
          awayName.toLowerCase().includes(searchTermLower) ||
          stadium.toLowerCase().includes(searchTermLower) ||
          league.toLowerCase().includes(searchTermLower);
      } catch (e) {
        matchesSearch = false;
      }

      const matchesLeague = !leagueFilter || league === leagueFilter;

      let matchesDay = true;
      if (selectedDate !== "all" && match.date) {
        // Normalize the match date to YYYY-MM-DD format
        const matchDate = new Date(match.date).toISOString().split("T")[0];
        matchesDay = matchDate === selectedDate;
      }

      return matchesSearch && matchesLeague && matchesDay;
    });

    setFilteredMatches(filtered);
  }

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchTerm("")
    setLeagueFilter("")
    setSelectedDate("all")
  }

  // Trier les matchs par date décroissante avant de les afficher
  const sortedMatches = [...filteredMatches].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className={`matches${darkMode ? " dark-mode" : ""}`} id="matches-section">
      <div className="container">
        <h2>Matchs Disponibles</h2>
        {/* <button onClick={fetchMatches} className="btn-refresh">Rafraîchir la liste</button> */}

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
          {/* Retour à l'ancien design : affichage sous forme de cartes */}
          {sortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} darkMode={darkMode} />
          ))}
        </div>

        {sortedMatches.length === 0 && (
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