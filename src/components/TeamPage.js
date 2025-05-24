"use client"

import { useState, useEffect } from "react"
import SearchBar from "./SearchBar"
import CategoryFilter from "./CategoryFilter"
import TeamGrid from "./TeamGrid"
import "./TeamPage.css"

// Liste complète des équipes avec leurs logos
const teamsData = [
  // Ligue 1 Mobilis
{ id: 1, name: "USM Alger", logo: "/logos/Ligue1/usm_alger.png", category: "Ligue 1 Mobilis" },
{ id: 2, name: "JS Kabylie", logo: "/logos/Ligue1/js_kabylie.png", category: "Ligue 1 Mobilis" },
{ id: 3, name: "CR Belouizdad", logo: "/logos/Ligue1/cr_belouizdad.png", category: "Ligue 1 Mobilis" },
{ id: 4, name: "Paradou AC", logo: "/logos/Ligue1/paradou_ac.png", category: "Ligue 1 Mobilis" },
{ id: 5, name: "ES Sétif", logo: "/logos/Ligue1/es_setif.png", category: "Ligue 1 Mobilis" },
{ id: 6, name: "MC Alger", logo: "/logos/Ligue1/mc_alger.png", category: "Ligue 1 Mobilis" },
{ id: 7, name: "MC El Bayadh", logo: "/logos/Ligue1/mc_elbayadh.png", category: "Ligue 1 Mobilis" },
{ id: 8, name: "CS Constantine", logo: "/logos/Ligue1/cs_constantine.png", category: "Ligue 1 Mobilis" },
{ id: 9, name: "ASO Chlef", logo: "/logos/Ligue1/aso_chlef.png", category: "Ligue 1 Mobilis" },
{ id: 10, name: "JS Saoura", logo: "/logos/Ligue1/js_saoura.png", category: "Ligue 1 Mobilis" },
{ id: 11, name: "MC Oran", logo: "/logos/Ligue1/mc_oran.png", category: "Ligue 1 Mobilis" },
{ id: 12, name: "Olympique Akbou", logo: "/logos/Ligue1/o_akbou.png", category: "Ligue 1 Mobilis" },
{ id: 13, name: "USM Khenchela", logo: "/logos/Ligue1/usm_khenchela.png", category: "Ligue 1 Mobilis" },
{ id: 14, name: "US Biskra", logo: "/logos/Ligue1/us_biskra.png", category: "Ligue 1 Mobilis" },
{ id: 15, name: "NC Magra", logo: "/logos/Ligue1/nc_magra.png", category: "Ligue 1 Mobilis" },
{ id: 16, name: "ES Mostaganem", logo: "/logos/Ligue1/es_mostaganem.png", category: "Ligue 1 Mobilis" },


  // Ligue 2 Mobilis Est
  { id: 17, name: "AS Khroub", logo: "/logos/Ligue2_Est/as_khroub.png", category: "Ligue 2 Mobilis Est" },
  { id: 18, name: "CA Batna", logo: "/logos/Ligue2_Est/ca_batna.png", category: "Ligue 2 Mobilis Est" },
  { id: 19, name: "HB Chelghoum Laïd", logo: "/logos/Ligue2_Est/hb_chelghoumlaid.png", category: "Ligue 2 Mobilis Est" },
  { id: 20, name: "IB Khémis El Khechna", logo: "/logos/Ligue2_Est/ib_khemiselkhechna.png", category: "Ligue 2 Mobilis Est" },
  { id: 21, name: "IRB Ouargla", logo: "/logos/Ligue2_Est/irb_ouargla.png", category: "Ligue 2 Mobilis Est" },
  { id: 22, name: "JS Bordj Ménaïel", logo: "/logos/Ligue2_Est/js_bordjmenaiel.png", category: "Ligue 2 Mobilis Est" },
  { id: 23, name: "JS Djijel", logo: "/logos/Ligue2_Est/js_djijel.png", category: "Ligue 2 Mobilis Est" },
  { id: 24, name: "MO Constantine", logo: "/logos/Ligue2_Est/mo_constantine.png", category: "Ligue 2 Mobilis Est" },
  { id: 25, name: "MSP Batna", logo: "/logos/Ligue2_Est/msp_batna.png", category: "Ligue 2 Mobilis Est" },
  { id: 26, name: "NRB Teleghma", logo: "/logos/Ligue2_Est/nrb_teleghma.png", category: "Ligue 2 Mobilis Est" },
  { id: 27, name: "US Chaouia", logo: "/logos/Ligue2_Est/us_chaouia.png", category: "Ligue 2 Mobilis Est" },
  { id: 28, name: "US Souf", logo: "/logos/Ligue2_Est/us_souf.png", category: "Ligue 2 Mobilis Est" },
  { id: 29, name: "USM Annaba", logo: "/logos/Ligue2_Est/usm_annaba.png", category: "Ligue 2 Mobilis Est" },
  { id: 30, name: "USM El Harrach", logo: "/logos/Ligue2_Est/usm_elharrach.png", category: "Ligue 2 Mobilis Est" },
  { id: 31, name: "MB Rouissat", logo: "/logos/Ligue2_Est/mb_rouissat.png", category: "Ligue 2 Mobilis Est" },
  { id: 32, name: "Olympique Magrane", logo: "/logos/Ligue2_Est/olympique_magrane.png", category: "Ligue 2 Mobilis Est" },


  // Ligue 2 Mobilis Ouest
  { id: 33, name: "ASM Oran", logo: "/logos/Ligue2_Ouest/asm_oran.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 34, name: "CR Témouchent", logo: "/logos/Ligue2_Ouest/cr_temouchent.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 35, name: "ES Ben Aknoun", logo: "/logos/Ligue2_Ouest/es_benaknoun.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 36, name: "ESM Koléa", logo: "/logos/Ligue2_Ouest/esm_kolea.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 37, name: "GC Mascara", logo: "/logos/Ligue2_Ouest/gc_mascara.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 38, name: "JS El Biar", logo: "/logos/Ligue2_Ouest/js_elbiar.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 39, name: "JSM Tiaret", logo: "/logos/Ligue2_Ouest/jsm_tiaret.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 40, name: "MC Saïda", logo: "/logos/Ligue2_Ouest/mc_saida.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 41, name: "MCB Oued Sly", logo: "/logos/Ligue2_Ouest/mcb_ouedsly.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 42, name: "NA Hussein Dey", logo: "/logos/Ligue2_Ouest/na_husseindey.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 43, name: "RC Arbaâ", logo: "/logos/Ligue2_Ouest/rc_arbaa.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 44, name: "RC Kouba", logo: "/logos/Ligue2_Ouest/rc_kouba.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 45, name: "SC Mécheria", logo: "/logos/Ligue2_Ouest/sc_mecheria.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 46, name: "SKAF Khemis Miliana", logo: "/logos/Ligue2_Ouest/skaf_khemismiliana.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 47, name: "US Béchar Djedid", logo: "/logos/Ligue2_Ouest/us_bechardjedid.png", category: "Ligue 2 Mobilis Ouest" },
  { id: 48, name: "WA Mostaganem", logo: "/logos/Ligue2_Ouest/wa_mostaganem.png", category: "Ligue 2 Mobilis Ouest" },

]

function TeamPage({ darkMode }) {
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

      <TeamGrid teams={filteredTeams} darkMode={darkMode} />
    </div>
  )
}

export default TeamPage
