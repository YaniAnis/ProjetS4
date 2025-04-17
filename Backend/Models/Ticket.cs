namespace ProjetV1.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public int UtilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; }

        public int MatchId { get; set; }
        public Match Match { get; set; }
        public double Prix {  get; set; }
        public string Statut { get; set; } // Dispo ou Vendu
        public int NumPlace { get; set; }
        public Paiement Paiement { get; set; }

    }
}
