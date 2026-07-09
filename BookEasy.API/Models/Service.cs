namespace BookEasy.API.Models
{
    public class Service
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int Duration { get; set; } // u minutama
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int BusinessId { get; set; }

        // Navigation properties
        public Business? Business { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}