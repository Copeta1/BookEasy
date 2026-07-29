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
    public class BusinessController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusinessController(AppDbContext context)
        {
            _context = context;
        }

        private int GetBusinessId()
        {
            return int.Parse(User.FindFirstValue("BusinessId")!);
        }

        [HttpGet]
        public async Task<IActionResult> GetBusiness()
        {
            var businessId = GetBusinessId();
            var business = await _context.Businesses
                .FirstOrDefaultAsync(b => b.Id == businessId);

            if (business == null)
                return NotFound();

            return Ok(business);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateBusiness([FromBody] Business dto)
        {
            var businessId = GetBusinessId();

            var business = await _context.Businesses
                .FirstOrDefaultAsync(b => b.Id == businessId);

            if (business == null)
                return NotFound();

            business.Name = dto.Name;
            business.Description = dto.Description;
            business.Address = dto.Address;
            business.Phone = dto.Phone;
            business.Email = dto.Email;

            await _context.SaveChangesAsync();

            return Ok(business);
        }

        [HttpGet("public/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicBusiness(string slug)
        {
            var business = await _context.Businesses
                .FirstOrDefaultAsync(b => b.Slug == slug);

            if (business == null)
                return NotFound();

            return Ok(business);
        }
    }
}
