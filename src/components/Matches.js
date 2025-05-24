"use client"

import { useState, useEffect } from "react"
import CalendarNavigation from "./CalendarNavigation"
import FilterBar from "./FilterBar"
import MatchCard from "./MatchCard"
import ActiveFilters from "./ActiveFilters"

function Matches() {
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
        // Ligue 1
        const l1 = {
          "USM Alger": "/logos/Ligue1/usm_alger.png",
          "JS Kabylie": "/logos/Ligue1/js_kabylie.png",
          "CR Belouizdad": "/logos/Ligue1/cr_belouizdad.png",
          "Paradou AC": "/logos/Ligue1/paradou_ac.png",
          "ES Sétif": "/logos/Ligue1/es_setif.png",
          "MC Alger": "/logos/Ligue1/mc_alger.png",
          "MC El Bayadh": "/logos/Ligue1/mc_el_bayadh.png",
          "CS Constantine": "/logos/Ligue1/cs_constantine.png",
          "ASO Chlef": "/logos/Ligue1/aso_chlef.png",
          "JS Saoura": "/logos/Ligue1/js_saoura.png",
          "MC Oran": "/logos/Ligue1/mc_oran.png",
          "Olympique Akbou": "/logos/Ligue1/o_akbou.png",
          "USM Khenchela": "/logos/Ligue1/usm_khenchela.png",
          "US Biskra": "/logos/Ligue1/us_biskra.png",
          "NC Magra": "/logos/Ligue1/nc_magra.png",
          "ES Mostaganem": "/logos/Ligue1/es_mostaganem.png",
        };
        // Ligue 2 Est
        const l2e = {
          "AS Khroub": "/logos/Ligue2_Est/as_khroub.png",
          "CA Batna": "/logos/Ligue2_Est/ca_batna.png",
          "HB Chelghoum Laïd": "/logos/Ligue2_Est/hb_chelghoum_laid.png",
          "IB Khémis El Khechna": "/logos/Ligue2_Est/ib_khemis_el_khechna.png",
          "IRB Ouargla": "/logos/Ligue2_Est/irb_ouargla.png",
          "JS Bordj Ménaïel": "/logos/Ligue2_Est/js_bordj_menaiel.png",
          "JS Djijel": "/logos/Ligue2_Est/js_djijel.png",
          "MO Constantine": "/logos/Ligue2_Est/mo_constantine.png",
          "MSP Batna": "/logos/Ligue2_Est/msp_batna.png",
          "NRB Teleghma": "/logos/Ligue2_Est/nrb_teleghma.png",
          "US Chaouia": "/logos/Ligue2_Est/us_chaouia.png",
          "US Souf": "/logos/Ligue2_Est/us_souf.png",
          "USM Annaba": "/logos/Ligue2_Est/usm_annaba.png",
          "USM El Harrach": "/logos/Ligue2_Est/usm_el_harrach.png",
          "MB Rouissat": "/logos/Ligue2_Est/mb_rouissat.png",
          "Olympique Magrane": "/logos/Ligue2_Est/olympique_magrane.png",
        };
        // Ligue 2 Ouest
        const l2o = {
          "ASM Oran": "/logos/Ligue2_Ouest/asm_oran.png",
          "CR Témouchent": "/logos/Ligue2_Ouest/cr_temouchent.png",
          "ES Ben Aknoun": "/logos/Ligue2_Ouest/es_ben_aknoun.png",
          "ESM Koléa": "/logos/Ligue2_Ouest/esm_kolea.png",
          "GC Mascara": "/logos/Ligue2_Ouest/gc_mascara.png",
          "JS El Biar": "/logos/Ligue2_Ouest/js_el_biar.png",
          "JSM Tiaret": "/logos/Ligue2_Ouest/jsm_tiaret.png",
          "MC Saïda": "/logos/Ligue2_Ouest/mc_saida.png",
          "MCB Oued Sly": "/logos/Ligue2_Ouest/mcb_oued_sly.png",
          "NA Hussein Dey": "/logos/Ligue2_Ouest/na_hussein_dey.png",
          "RC Arbaâ": "/logos/Ligue2_Ouest/rc_arbaa.png",
          "RC Kouba": "/logos/Ligue2_Ouest/rc_kouba.png",
          "SC Mécheria": "/logos/Ligue2_Ouest/sc_mecheria.png",
          "SKAF Khemis Miliana": "/logos/Ligue2_Ouest/skaf_khemis_miliana.png",
          "US Béchar Djedid": "/logos/Ligue2_Ouest/us_bechar_djedid.png",
          "WA Mostaganem": "/logos/Ligue2_Ouest/wa_mostaganem.png",
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
          logo: m.homeTeam?.logo || m.equipe1_logo || m.equipe1Logo || m.logo_equipe1 || "" // essaie plusieurs clés
        },
        awayTeam: {
          name: m.equipe2,
          logo: m.awayTeam?.logo || m.equipe2_logo || m.equipe2Logo || m.logo_equipe2 || ""
        },
        stadium: m.stade?.nom || "",
        price: m.zones && m.zones.length > 0 ? Math.min(...m.zones.map(z => z.prix)) : "",
        zones: m.zones || [],
        // ...add more fields as needed
      }));
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

      // Defensive: ensure all fields are strings before .toLowerCase()
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
        try {
          const dateParts = (typeof match.date === "string" ? match.date : "").split(" ");
          if (!dateParts[1] || typeof dateParts[1] !== "string") {
            matchesDay = false;
          } else {
            const day = Number.parseInt(dateParts[0]);
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
            };
            const monthKey = dateParts[1].toLowerCase();
            const month = monthNames[monthKey];
            const year = Number.parseInt(dateParts[2]);
            if (!month || isNaN(day) || isNaN(year)) {
              matchesDay = false;
            } else {
              const formattedDate = `${year}-${month}-${day < 10 ? "0" + day : day}`;
              matchesDay = formattedDate === selectedDate;
            }
          }
        } catch (e) {
          matchesDay = false;
        }
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
    <section className="matches" id="matches-section">
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
            <MatchCard key={match.id} match={match} />
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