namespace BookEasy.API.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Type { get; set; } = "First Visit";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int BusinessId { get; set; }

        // Navigation properties
        public Business? Business { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}