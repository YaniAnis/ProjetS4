using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjetV1.DTOs;
using ProjetV1.Models;
using ProjetV1.Services;

namespace ProjetV1.Controllers
{
    [ApiController]
    [Route("api/utilisateur")]
    public class UtilisateurController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AuthService _authService;

        public UtilisateurController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            AuthService authService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authService = authService;
        }

        [HttpPost("inscription")]
        public async Task<IActionResult> Inscription([FromBody] RegisterRequest model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Les mots de passe ne correspondent pas." });
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Nom = model.Nom,
                Prenom = model.Prenom
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Inscription réussie !" });
            }

            return BadRequest(result.Errors);
        }
        [HttpPost("connexion")]
        public async Task<IActionResult> Connexion([FromBody] UserLoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                Console.WriteLine($"Utilisateur non trouvé : {request.Email}"); // Log
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.MotDePasse, false);
            if (!result.Succeeded)
            {
                Console.WriteLine($"Mot de passe incorrect pour : {request.Email}"); // Log
                return Unauthorized(new { message = "Email ou mot de passe incorrect." });
            }

            var token = _authService.GenerateJwtToken(user);
            Console.WriteLine($"Token généré : {token}"); // Log

            
        

            return Ok(new
            {
                Token = token,
                user.Email,
                user.Nom,
                user.Prenom,
                Message = "Connexion réussie !"
            });
        }

        [Authorize]
        [HttpGet("profil")]
        public IActionResult GetUserProfile()
        {
            var email = User.Identity?.Name;
            return Ok(new
            {
                Message = "Voici ton profil !",
                Email = email
            });
        }
    }
}
