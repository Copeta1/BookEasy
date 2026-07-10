using BookEasy.API.Data;
using BookEasy.API.DTOs.Auth;
using BookEasy.API.Helpers;
using BookEasy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookEasy.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDto?> Register(RegisterDto dto)
        {
            // Check if the email is already registered
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
                return null; // Email already registered

            // Check password
            if (dto.Password != dto.ConfirmPassword)
                return null; // Password do not match 


            // Create a new user
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // new Id for user

            // Create a new business
            var business = new Business
            {
                Name = dto.BusinessName,
                Slug = dto.BusinessName.ToLower().Replace(" ", "-"),
                Email = dto.Email,
                UserId = user.Id
                
            };

            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            // Generate a JWT token for the User
            var token = _jwtHelper.GenerateToken(user, business.Id);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BusinessName = business.Name,
                BusinessId = business.Id
            };
        }

        public async Task<AuthResponseDto?> Login(LoginDto dto)
        {
            // Find the user by email
            var user = await _context.Users
                .Include(u => u.Business)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null) return null;

            // Check the password
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return null; //Invalid password

            // Generate a JWT token for the User
            var token = _jwtHelper.GenerateToken(user, user.Business!.Id);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BusinessName = user.Business.Name,
                BusinessId = user.Business.Id
            };
        }
    }
}
