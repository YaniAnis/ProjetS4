using Microsoft.AspNetCore.Mvc;
using ProjetV1.Data;
using ProjetV1.Models;

namespace ProjetV1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Utilisateur utilisateur)
        {

            if (_context.Utilisateurs.Any(u => u.Email == utilisateur.Email))
            {
                return BadRequest("Cet email est déjà utilisé.");
            }

            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();
            return Ok(utilisateur);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto data)
        {
            var user = _context.Utilisateurs
                .FirstOrDefault(u => u.Email == data.Email && u.MotDePasse == data.MotDePasse);

            if (user == null)
                return Unauthorized("Email ou mot de passe incorrect");

            return Ok(new { message = "Connexion réussie", user });
        }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string MotDePasse { get; set; }
    }
}
