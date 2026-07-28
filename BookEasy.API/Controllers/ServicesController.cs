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
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        private int GetBusinessId()
        {
            return int.Parse(User.FindFirstValue("BusinessId")!);
        }

        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            var businessId = GetBusinessId();

            var services = await _context.Services
                .Where(s => s.BusinessId == businessId)
                .ToListAsync();

            return Ok(services);
        }

        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] Service dto)
        {
            var businessId = GetBusinessId();

            var service = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                Duration = dto.Duration,
                Price = dto.Price,
                BusinessId = businessId
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] Service dto)
        {
            var businessId = GetBusinessId();

            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id && s.BusinessId == businessId);

            if (service == null)
                return NotFound();

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.Category = dto.Category;
            service.Duration = dto.Duration;
            service.Price = dto.Price;
            service.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(service);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var businessId = GetBusinessId();

            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id && s.BusinessId == businessId);

            if (service == null)
                return NotFound();

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service deleted successfully." });
        }
    }
}