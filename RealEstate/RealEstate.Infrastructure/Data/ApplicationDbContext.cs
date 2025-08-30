using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Data
{
  public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
  {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets
    public DbSet<Property> Properties { get; set; } = null!;
    public DbSet<PropertyMedia> PropertyMedias { get; set; } = null!;
    public DbSet<PropertyType> PropertyTypes { get; set; } = null!;
    public DbSet<PropertyStatus> PropertyStatuses { get; set; } = null!;
    public DbSet<Currency> Currencies { get; set; } = null!;
    public DbSet<Location> Locations { get; set; } = null!;
    public DbSet<PropertyDetails> PropertyDetails { get; set; } = null!;
    public DbSet<Favorite> Favorites { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<Conversation> Conversations { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Property -> PropertyType (Many-to-One)
      modelBuilder.Entity<Property>()
          .HasOne(p => p.Type)
          .WithMany(pt => pt.Properties)
          .HasForeignKey(p => p.PropertyTypeId)
          .OnDelete(DeleteBehavior.Restrict);

      // Property -> PropertyStatus (Many-to-One)
      modelBuilder.Entity<Property>()
          .HasOne(p => p.Status)
          .WithMany(ps => ps.Properties)
          .HasForeignKey(p => p.PropertyStatusId)
          .OnDelete(DeleteBehavior.Restrict);

      // Property -> Currency (Many-to-One)
      modelBuilder.Entity<Property>()
          .HasOne(p => p.Currency)
          .WithMany(c => c.Properties)
          .HasForeignKey(p => p.CurrencyId)
          .OnDelete(DeleteBehavior.Restrict);

      // Property -> ApplicationUser (Many-to-One)
      modelBuilder.Entity<Property>()
          .HasOne(p => p.Owner)
          .WithMany(u => u.Properties)
          .HasForeignKey(p => p.OwnerId)
          .OnDelete(DeleteBehavior.Restrict);

      // PropertyMedia -> Property (Many-to-One)
      modelBuilder.Entity<PropertyMedia>()
          .HasOne(pm => pm.Property)
          .WithMany(p => p.Media)
          .HasForeignKey(pm => pm.PropertyId)
          .OnDelete(DeleteBehavior.Cascade);

      // Property -> Location (One-to-One)
      modelBuilder.Entity<Property>()
        .HasOne(p => p.Location)
        .WithOne(l => l.Property)
        .HasForeignKey<Property>(p => p.LocationId)
        .OnDelete(DeleteBehavior.SetNull);

      // Property -> PropertyDetails (One-to-One)
      modelBuilder.Entity<Property>()
        .HasOne(p => p.Details)
        .WithOne(d => d.Property)
        .HasForeignKey<Property>(p => p.PropertyDetailsId)
        .OnDelete(DeleteBehavior.Cascade);

      // Favorite - User relationship
      modelBuilder.Entity<Favorite>()
          .HasOne(f => f.User)
          .WithMany(u => u.Favorites)
          .HasForeignKey(f => f.UserId)
          .OnDelete(DeleteBehavior.Cascade);

      // Favorite - Property relationship
      modelBuilder.Entity<Favorite>()
          .HasOne(f => f.Property)
          .WithMany(p => p.Favorites)
          .HasForeignKey(f => f.PropertyId)
          .OnDelete(DeleteBehavior.Cascade);

      // Favorite unique constraint
      modelBuilder.Entity<Favorite>()
        .HasIndex(f => new { f.UserId, f.PropertyId })
        .IsUnique();

      // Message - Sender relationship
      modelBuilder.Entity<Message>()
          .HasOne(m => m.Sender)
          .WithMany()
          .HasForeignKey(m => m.SenderId)
          .OnDelete(DeleteBehavior.Restrict);

      // Message - Receiver relationship
      modelBuilder.Entity<Message>()
          .HasOne(m => m.Receiver)
          .WithMany()
          .HasForeignKey(m => m.ReceiverId)
          .OnDelete(DeleteBehavior.Restrict);

      // Conversation - Messages (1 -> N)
      modelBuilder.Entity<Conversation>()
          .HasMany(c => c.Messages)
          .WithOne(m => m.Conversation!)
          .HasForeignKey(m => m.ConversationId)
          .OnDelete(DeleteBehavior.Cascade);

      
      // Conversation - Property
      modelBuilder.Entity<Conversation>()
          .HasOne(c => c.Property)
          .WithMany()
          .HasForeignKey(c => c.PropertyId)
          .OnDelete(DeleteBehavior.Restrict);

      // Tekil konuşma garantisi: aynı iki kullanıcı + aynı ilan için tek kayıt
      modelBuilder.Entity<Conversation>()
          .HasIndex(c => new { c.SmallerUserId, c.LargerUserId, c.PropertyId })
          .IsUnique();

      // Mesaj sorgu performansı için indeks
      modelBuilder.Entity<Message>()
          .HasIndex(m => new { m.ConversationId, m.CreatedAt });

      // Price precision for decimal fields
      modelBuilder.Entity<Property>()
          .Property(p => p.Price)
          .HasPrecision(18, 2);

      modelBuilder.Entity<Property>()
          .Property(p => p.Deposit)
          .HasPrecision(18, 2);

      modelBuilder.Entity<Property>()
          .Property(p => p.MonthlyFee)
          .HasPrecision(18, 2);

      // Unique constraints
      modelBuilder.Entity<Currency>()
          .HasIndex(c => c.Code)
          .IsUnique();

      // Seed Data
      var Seed = new Seed();
      Seed.SeedData(modelBuilder);
    }

    public override int SaveChanges()
    {
      UpdateTimestamps();
      return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      UpdateTimestamps();
      return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
      var now = DateTime.UtcNow;
      foreach (var entry in ChangeTracker.Entries())
      {
        if (entry.Entity is ITimestamped entity)
        {
          if (entry.State == EntityState.Added)
          {
            entity.CreatedDate = now;
          }
          else if (entry.State == EntityState.Modified)
          {
            entity.LastModifiedDate = now;
          }
        }
      }
    }
  }
}