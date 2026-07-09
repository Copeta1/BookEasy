namespace BookEasy.API.Models
{
    public enum AppointmentStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int BusinessId { get; set; }
        public int ServiceId { get; set; }
        public int ClientId { get; set; }

        // Navigation properties
        public Business? Business { get; set; }
        public Service? Service { get; set; }
        public Client? Client { get; set; }
    }
}
