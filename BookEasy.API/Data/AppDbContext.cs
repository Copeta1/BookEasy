using BookEasy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookEasy.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { 
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //User -> Business (One to One)
            modelBuilder.Entity<Business>()
                .HasOne(b => b.User)
                .WithOne(u => u.Business)
                .HasForeignKey<Business>(b => b.UserId);

            //Business -> Service (One to Many)
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Business)
                .WithMany(b => b.Services)
                .HasForeignKey(s => s.BusinessId);

            //Business -> Client (One to Many)
            modelBuilder.Entity<Client>()
                .HasOne(c => c.Business)
                .WithMany(b => b.Clients)
                .HasForeignKey(c => c.BusinessId);

            //Business -> Appointment (One to Many)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Business)
                .WithMany(b => b.Appointments)
                .HasForeignKey(a => a.BusinessId);

            //Service -> Appointment (One to Many)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany(s => s.Appointments)
                .HasForeignKey(a => a.ServiceId);

            //Client -> Appointment (One to Many)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Client)
                .WithMany(c => c.Appointments)
                .HasForeignKey(a => a.ClientId);

            //Business -> Subscription (One to Many)
            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.Business)
                .WithOne(b => b.Subscription)
                .HasForeignKey<Subscription>(s => s.BusinessId);

            //Decimal precision for Price in Service
            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasPrecision(10, 2); //Adjust precision
        }

    }
}
