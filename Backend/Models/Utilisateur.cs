using System.ComponentModel.DataAnnotations;

public class Utilisateur
{
    public int Id { get; set; } 
    public string Nom { get; set; }
    public string Prenom { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string MotDePasse { get; set; }
}
