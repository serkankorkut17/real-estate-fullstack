using Microsoft.AspNetCore.Identity;

namespace RealEstate.Domain.Entities;

public class ApplicationRole : IdentityRole<int>
{
    public string? Description { get; set; }
    public DateTime CreatedDate { get; set; }
}
