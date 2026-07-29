using BookEasy.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookEasy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetBusinessId()
        {
            return int.Parse(User.FindFirstValue("BusinessId")!);
        }

        [HttpGet]
        public async Task<IActionResult> GetAnalytics()
        {
            var businessId = GetBusinessId();
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);

            var appointments = await _context.Appointments
                .Include(a => a.Service)
                .Where(a => a.BusinessId == businessId && a.StartTime >= sixMonthsAgo)
                .ToListAsync();

            // Grupiraj po mjesecu
            var monthlyData = appointments
                .GroupBy(a => new { a.StartTime.Year, a.StartTime.Month })
                .Select(g => new
                {
                    month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                    bookings = g.Count(),
                    revenue = g.Sum(a => a.Service != null ? a.Service.Price : 0)
                })
                .OrderBy(x => x.month)
                .ToList();

            var totalBookings = appointments.Count;
            var totalRevenue = appointments.Sum(a => a.Service != null ? a.Service.Price : 0);
            var totalClients = await _context.Clients
                .Where(c => c.BusinessId == businessId)
                .CountAsync();

            return Ok(new
            {
                monthlyData,
                totalBookings,
                totalRevenue,
                totalClients,
                avgBookingsPerMonth = monthlyData.Count > 0 ? totalBookings / monthlyData.Count : 0,
                avgRevenuePerMonth = monthlyData.Count > 0 ? totalRevenue / monthlyData.Count : 0
            });
        }
    }
}