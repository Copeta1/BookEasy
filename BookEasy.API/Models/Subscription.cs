namespace BookEasy.API.Models
{
    public enum SubscriptionPlan
    {
        Starter,
        Professional
    }

    public enum SubscriptionStatus
    {
        Active,
        Cancelled,
        Expired
    }

    public class Subscription
    {
        public int Id { get; set; }
        public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Starter;
        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
        public string StripeCustomerId { get; set; } = string.Empty;
        public string StripeSubscriptionId { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int BusinessId { get; set; }

        // Navigation property
        public Business? Business { get; set; }
    }
}