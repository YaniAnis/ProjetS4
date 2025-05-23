"use client"
import Select from "react-select";

const leagueOptions = [
  { value: "", label: "Toutes les ligues" },
  { value: "Ligue 1 Mobilis", label: "Ligue 1 Mobilis" },
  { value: "Ligue 2 Mobilis Est", label: "Ligue 2 Mobilis Est" },
  { value: "Ligue 2 Mobilis Ouest", label: "Ligue 2 Mobilis Ouest" },
];

function FilterBar({ searchTerm, setSearchTerm, leagueFilter, setLeagueFilter }) {
  return (
    <div className="filter-bar">
      <div className="search">
        <input
          type="text"
          id="search-input"
          placeholder="Rechercher un match..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="filters">
        <Select
          id="filter-league"
          value={leagueOptions.find((opt) => opt.value === leagueFilter)}
          onChange={(opt) => setLeagueFilter(opt.value)}
          options={leagueOptions}
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "#1a472a"
                : state.isFocused
                ? "#f2f2f2"
                : undefined,
              color: state.isSelected ? "#fff" : undefined,
              fontWeight: state.isSelected ? "bold" : undefined,
            }),
            control: (provided, state) => ({
              ...provided,
              backgroundColor: "#1a472a",
              color: "#fff",
              boxShadow: "none",         // retire la bordure bleue
              borderColor: "#1a472a",    // couleur de la bordure (vert)
              "&:hover": {
                borderColor: "#1a472a",  // garde la bordure verte au hover
              },
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "#fff",
            }),
          }}
        />
      </div>
    </div>
  );
}

export default FilterBar;