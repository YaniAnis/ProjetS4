using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetV1.Data;
using ProjetV1.Models;

namespace ProjetV1.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class FrontController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FrontController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
        {
            return await _context.Tickets.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTickets), new { id = ticket.Id }, ticket);
        }
    }
}