using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjetV1.DTOs
{
    public class UserLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        [JsonPropertyName("MotDePasse")]
        public string MotDePasse { get; set; }
    }
}
