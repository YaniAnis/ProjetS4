namespace ProjetV1.Models
{
    public class Match
    {
        public int Id { get; set; }
        public string Equipe1 { get; set; }
        public string Equipe2 { get; set; }
        public DateTime DateHeur { get; set; }
        public string Lieu { get; set; }
        public Stade Stade { get; set; }

    }
}
