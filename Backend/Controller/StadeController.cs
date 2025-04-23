using Microsoft.AspNetCore.Mvc;
using ProjetV1.Data;
using ProjetV1.Models;

namespace ProjetV1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StadeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StadeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Stades.ToList());

        [HttpPost]
        public IActionResult Post([FromBody] Stade stade)
        {
            _context.Stades.Add(stade);
            _context.SaveChanges();
            return Ok(stade);
        }
    }
}