using BookEasy.API.Data;
using BookEasy.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BookEasy.API.DTOs.Appointments;

namespace BookEasy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        private int GetBusinessId()
        {
            return int.Parse(User.FindFirstValue("BusinessId")!);
        }

        private async Task<bool> HasOverlapAsync(int businessId, DateTime start, DateTime end, int? excludeId = null)
        {
            return await _context.Appointments.AnyAsync(a =>
                a.BusinessId == businessId &&
                a.Status != AppointmentStatus.Cancelled &&
                (excludeId == null || a.Id != excludeId) &&
                a.StartTime < end &&
                a.EndTime > start);
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var businessId = GetBusinessId();

            var appointments = await _context.Appointments
                .Include(a => a.Client)
                .Include(a => a.Service)
                .Where(a => a.BusinessId == businessId)
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayAppointments()
        {
            var businessId = GetBusinessId();
            var today = DateTime.UtcNow.Date;

            var appointments = await _context.Appointments
                .Include(a => a.Client)
                .Include(a => a.Service)
                .Where(a => a.BusinessId == businessId &&
                            a.StartTime.Date == today)
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment dto)
        {
            var businessId = GetBusinessId();

            if (await HasOverlapAsync(businessId, dto.StartTime, dto.EndTime))
                return Conflict(new { message = "This time slot overlaps with an existing appointment." });

            var appointment = new Appointment
            {
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Notes = dto.Notes,
                Status = AppointmentStatus.Pending,
                BusinessId = businessId,
                ServiceId = dto.ServiceId,
                ClientId = dto.ClientId
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(appointment);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] AppointmentStatus status)
        {
            var businessId = GetBusinessId();

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.BusinessId == businessId);

            if (appointment == null)
                return NotFound();

            appointment.Status = status;
            await _context.SaveChangesAsync();

            return Ok(appointment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var businessId = GetBusinessId();

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.BusinessId == businessId);

            if (appointment == null)
                return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment deleted successfully." });
        }

        [HttpGet("public/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicAppointments(string slug, [FromQuery] DateTime date)
        {
            var business = await _context.Businesses
                .FirstOrDefaultAsync(b => b.Slug == slug);

            if (business == null)
                return NotFound();

            var dayStart = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
            var dayEnd = dayStart.AddDays(1);

            var appointments = await _context.Appointments
                .Where(a => a.BusinessId == business.Id &&
                            a.StartTime >= dayStart && a.StartTime < dayEnd &&
                            a.Status != AppointmentStatus.Cancelled)
                .Select(a => new { a.StartTime, a.EndTime })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpPost("public")]
        [AllowAnonymous]
        public async Task<IActionResult> CreatePublicAppointment([FromBody] PublicAppointmentDto dto)
        {
            if (await HasOverlapAsync(dto.BusinessId, dto.StartTime, dto.EndTime))
                return Conflict(new { message = "This time slot is no longer available." });

            // Pronađi ili kreiraj klijenta
            var client = await _context.Clients
                .FirstOrDefaultAsync(c => c.Email == dto.ClientEmail && c.BusinessId == dto.BusinessId);

            if (client == null)
            {
                client = new Client
                {
                    FirstName = dto.ClientFirstName,
                    LastName = dto.ClientLastName,
                    Email = dto.ClientEmail,
                    Phone = dto.ClientPhone,
                    Type = "First Visit",
                    BusinessId = dto.BusinessId
                };
                _context.Clients.Add(client);
                await _context.SaveChangesAsync();
            }

            var appointment = new Appointment
            {
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Status = AppointmentStatus.Pending,
                BusinessId = dto.BusinessId,
                ServiceId = dto.ServiceId,
                ClientId = client.Id
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked successfully." });
        }
    }
}