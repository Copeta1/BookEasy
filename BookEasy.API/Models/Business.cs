namespace BookEasy.API.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //Foreign key to User
        public int UserId { get; set; }

        // Navigation properties
        public User? User { get; set; }
        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Client> Clients { get; set; } = new List<Client>();
        public Subscription? Subscription { get; set; }


    }
}
