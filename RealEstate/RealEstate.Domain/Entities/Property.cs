using System.ComponentModel.DataAnnotations;

namespace RealEstate.Domain.Entities;

public class Property : ITimestamped
{
    public int Id { get; set; }
    // Basic Info
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Type and Status
    [Required]
    public int PropertyTypeId { get; set; }
    public virtual PropertyType? Type { get; set; }
    [Required]
    public int PropertyStatusId { get; set; }
    public virtual PropertyStatus? Status { get; set; }

    // Location
    public int? LocationId { get; set; }
    public virtual Location? Location { get; set; }

    // Price and Financial
    [Required]
    public decimal Price { get; set; }
    [Required]
    public int CurrencyId { get; set; }
    public virtual Currency? Currency { get; set; }
    public decimal? Deposit { get; set; }
    public decimal? MonthlyFee { get; set; }

    // Property Details
    public int? PropertyDetailsId { get; set; }
    public virtual PropertyDetails? Details { get; set; }

    // Owner
    [Required]
    public int OwnerId { get; set; }
    public virtual ApplicationUser? Owner { get; set; }
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    // Media (photos, videos)
    public ICollection<PropertyMedia> Media { get; set; } = new List<PropertyMedia>();

    // Dates
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedDate { get; set; }

}
