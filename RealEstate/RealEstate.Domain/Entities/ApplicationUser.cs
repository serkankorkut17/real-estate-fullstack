using Microsoft.AspNetCore.Identity;

namespace RealEstate.Domain.Entities;

public class ApplicationUser : IdentityUser<int>, ITimestamped
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public DateTime? LastLoginDate { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModifiedDate { get; set; }

    // Navigation properties
    public virtual ICollection<Property> Properties { get; set; } = [];
    public virtual ICollection<Favorite> Favorites { get; set; } = [];
}
