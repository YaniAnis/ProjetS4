namespace ProjetV1.Models
{
    public class Utilisateur
    {
        public int Id { get; set; }
        public String Nom { get; set; }
        public String Prenom { get; set; }
        public String email { get; set; }
        public String phone { get; set; }
        public String MotDePasse { get; set; } // on devra le hasher

        public String Role { get; set; } // admin ou client

        public ICollection<Ticket> Ticket { get; set; }
    }
}
