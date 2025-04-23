using Microsoft.AspNetCore.Mvc;
using ProjetV1.Data;
using ProjetV1.Models;

namespace ProjetV1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaiementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaiementController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Paiements.ToList());

        [HttpPost]
        public IActionResult Post([FromBody] Paiement paiement)
        {
            _context.Paiements.Add(paiement);
            _context.SaveChanges();
            return Ok(paiement);
        }
    }
}
