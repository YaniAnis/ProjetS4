"use client"

import { useState, useEffect } from "react"
import SearchBar from "./SearchBar"
import CategoryFilter from "./CategoryFilter"
import TeamGrid from "./TeamGrid"
import "./TeamPage.css"

// Liste complète des équipes avec leurs logos
const teamsData = [
  // Ligue 1 Mobilis
  { id: 1, name: "CR Belouizdad", logo: "/logos/cr_belouizdad.png", category: "Ligue 1 Mobilis" },
  { id: 2, name: "MC Alger", logo: "/logos/mc_alger.png", category: "Ligue 1 Mobilis" },
  { id: 3, name: "CS Constantine", logo: "/logos/cs_constantine.png", category: "Ligue 1 Mobilis" },
  { id: 4, name: "USM Alger", logo: "/logos/usm_alger.png", category: "Ligue 1 Mobilis" },
  { id: 5, name: "ES Sétif", logo: "/logos/es_setif.png", category: "Ligue 1 Mobilis" },
  { id: 6, name: "Paradou AC", logo: "/logos/paradou_ac.png", category: "Ligue 1 Mobilis" },
  { id: 7, name: "JS Saoura", logo: "/logos/js_saoura.png", category: "Ligue 1 Mobilis" },
  { id: 8, name: "JS Kabylie", logo: "/logos/js_kabylie.png", category: "Ligue 1 Mobilis" },
  { id: 9, name: "MC Oran", logo: "/logos/mc_oran.png", category: "Ligue 1 Mobilis" },
  { id: 10, name: "ASO Chlef", logo: "/logos/aso_chlef.png", category: "Ligue 1 Mobilis" },
  { id: 11, name: "US Biskra", logo: "/logos/us_biskra.png", category: "Ligue 1 Mobilis" },
  { id: 12, name: "NC Magra", logo: "/logos/nc_magra.png", category: "Ligue 1 Mobilis" },
  { id: 13, name: "MC El Bayadh", logo: "/logos/mc_el_bayadh.png", category: "Ligue 1 Mobilis" },
  { id: 14, name: "US Souf", logo: "/logos/us_souf.png", category: "Ligue 1 Mobilis" },
  { id: 15, name: "Ben Aknoun", logo: "/logos/ben_aknoun.png", category: "Ligue 1 Mobilis" },
  { id: 16, name: "US Khenchela", logo: "/logos/us_khenchela.png", category: "Ligue 1 Mobilis" },

  // Ligue 2 Mobilis Est
  { id: 17, name: "USM Annaba", logo: "/logos/usm_annaba.png", category: "Ligue 2 Mobilis Est" },
  { id: 18, name: "MO Constantine", logo: "/logos/mo_constantine.png", category: "Ligue 2 Mobilis Est" },
  { id: 19, name: "AS Khroub", logo: "/logos/as_khroub.png", category: "Ligue 2 Mobilis Est" },
  { id: 20, name: "CA Batna", logo: "/logos/ca_batna.png", category: "Ligue 2 Mobilis Est" },
  { id: 21, name: "JSM Skikda", logo: "/logos/jsm_skikda.png", category: "Ligue 2 Mobilis Est" },
  { id: 22, name: "HB Chelghoum Laïd", logo: "/logos/hb_chelghoum_laid.png", category: "Ligue 2 Mobilis Est" },
  { id: 23, name: "MSP Batna", logo: "/logos/msp_batna.png", category: "Ligue 2 Mobilis Est" },
  { id: 24, name: "US Chaouia", logo: "/logos/us_chaouia.png", category: "Ligue 2 Mobilis Est" },
  { id: 25, name: "CA Bordj Bou Arreridj", logo: "/logos/ca_bordj_bou_arreridj.png", category: "Ligue 2 Mobilis Est" },
  { id: 26, name: "MC El Eulma", logo: "/logos/mc_el_eulma.png", category: "Ligue 2 Mobilis Est" },
  { id: 27, name: "E Sour Ghozlane", logo: "/logos/e_sour_ghozlane.png", category: "Ligue 2 Mobilis Est" },
  { id: 28, name: "NRB Teleghma", logo: "/logos/nrb_teleghma.png", category: "Ligue 2 Mobilis Est" },
  { id: 29, name: "IRB Ouargla", logo: "/logos/irb_ouargla.png", category: "Ligue 2 Mobilis Est" },
  { id: 30, name: "MB Rouissat", logo: "/logos/mb_rouissat.png", category: "Ligue 2 Mobilis Est" },
  { id: 31, name: "JSM Béjaïa", logo: "/logos/jsm_bejaia.png", category: "Ligue 2 Mobilis Est" },
  { id: 32, name: "MO Béjaïa", logo: "/logos/mo_bejaia.png", category: "Ligue 2 Mobilis Est" },

  // Ligue 2 Mobilis Ouest
  { id: 33, name: "RC Arbaâ", logo: "/logos/rc_arbaa.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 34, name: "ESM Koléa", logo: "/logos/esm_kolea.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 35, name: "WA Boufarik", logo: "/logos/wa_boufarik.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 36, name: "RC Kouba", logo: "/logos/rc_kouba.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 37, name: "NA Hussein Dey", logo: "/logos/na_hussein_dey.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 38, name: "WA Tlemcen", logo: "/logos/wa_tlemcen.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 39, name: "SKAF Khemis Miliana", logo: "/logos/skaf_khemis_miliana.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 40, name: "SC Mecheria", logo: "/logos/sc_mecheria.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 41, name: "MCB Oued Sly", logo: "/logos/mcb_oued_sly.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 42, name: "JSM Tiaret", logo: "/logos/jsm_tiaret.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 43, name: "CR Témouchent", logo: "/logos/cr_temouchent.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 44, name: "GC Mascara", logo: "/logos/gc_mascara.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 45, name: "ES Mostaganem", logo: "/logos/es_mostaganem.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 46, name: "SA Mohammadia", logo: "/logos/sa_mohammadia.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 47, name: "USM Bel Abbès", logo: "/logos/usm_bel_abbes.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 48, name: "MB Hassasna", logo: "/logos/mb_hassasna.png", category: "Ligue 2 Mobilis Ouest" },
]

function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredTeams, setFilteredTeams] = useState(teamsData)

  const categories = ["Ligue 1 Mobilis", "Ligue 2 Mobilis Est", "Ligue 2 Mobilis Ouest"]

  useEffect(() => {
    let result = teamsData

    // Filtrer par recherche
    if (searchTerm) {
      result = result.filter((team) => team.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
    }

    // Filtrer par catégorie
    if (selectedCategory) {
      result = result.filter((team) => team.category === selectedCategory)
    }

    setFilteredTeams(result)
  }, [searchTerm, selectedCategory])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  // Obtenir le nombre d'équipes par catégorie
  const getCategoryCount = () => {
    if (selectedCategory) {
      return `${filteredTeams.length} équipe${filteredTeams.length > 1 ? "s" : ""}`
    }
    return `${filteredTeams.length} équipes au total`
  }

  return (
    <div className="team-page">
      <div className="filters-container">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      <div>
        <h2 className="category-title">{selectedCategory || "Toutes les équipes"}</h2>
        <div className="category-count">{getCategoryCount()}</div>
      </div>

      <TeamGrid teams={filteredTeams} />
    </div>
  )
}

export default TeamPage
