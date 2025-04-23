using Microsoft.AspNetCore.Mvc;
using ProjetV1.Data;
using ProjetV1.Models;

namespace ProjetV1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MatchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get() => Ok(_context.Matchs.ToList());

        [HttpPost]
        public IActionResult Post([FromBody] Match match)
        {
            _context.Matchs.Add(match);
            _context.SaveChanges();
            return Ok(match);
        }
    }
}