using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PropertyId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        // Navigation properties
        public ApplicationUser? User { get; set; }
        public Property? Property { get; set; }
    }
}