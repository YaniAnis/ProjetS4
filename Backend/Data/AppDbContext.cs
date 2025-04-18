﻿using Microsoft.EntityFrameworkCore;
using ProjetV1.Models;

namespace ProjetV1.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Match> Matchs { get; set; }
        public DbSet<Stade> Stades { get; set; }

        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Paiement> Paiements { get; set; }
    }
}
