using BookEasy.API.Data;
using BookEasy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookEasy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetBusinessId()
        {
            return int.Parse(User.FindFirstValue("BusinessId")!);
        }

        [HttpGet]
        public async Task<IActionResult> GetClients()
        {
            var businessId = GetBusinessId();

            var clients = await _context.Clients
                .Where(c => c.BusinessId == businessId)
                .ToListAsync();

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClient(int id)
        {
            var businessId = GetBusinessId();

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id && c.BusinessId == businessId);

            if (client == null)
                return NotFound();

            return Ok(client);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClient([FromBody] Client dto)
        {
            var businessId = GetBusinessId();

            var client = new Client
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Type = dto.Type,
                BusinessId = businessId
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            return Ok(client);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] Client dto)
        {
            var businessId = GetBusinessId();

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id && c.BusinessId == businessId);

            if (client == null)
                return NotFound();

            client.FirstName = dto.FirstName;
            client.LastName = dto.LastName;
            client.Email = dto.Email;
            client.Phone = dto.Phone;
            client.Type = dto.Type;

            await _context.SaveChangesAsync();

            return Ok(client);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var businessId = GetBusinessId();

            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == id && c.BusinessId == businessId);

            if (client == null)
                return NotFound();

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Client deleted successfully." });
        }
    }
}