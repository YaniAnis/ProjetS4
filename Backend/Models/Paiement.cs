namespace ProjetV1.Models
{
    public class Paiement
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; }
        public int UtilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; }
        public string ModePaiment { get; set; }
        public string Statut { get; set; } // valide ou refuse
    }
}
