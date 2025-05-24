"use client"
import { useState, useRef, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";

const leagueOptions = [
  "Ligue 1",
  "Coupe Algérie",
  "Champions League"
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
        <CategoryFilter
          categories={leagueOptions}
          selectedCategory={leagueFilter}
          onSelectCategory={setLeagueFilter}
        />
      </div>
    </div>
  );
}

export default FilterBar;