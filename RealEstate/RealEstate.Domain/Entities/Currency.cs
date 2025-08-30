using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
    public class Currency
    {
        public int Id { get; set; }
        [Required]
        public string Code { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Symbol { get; set; } = string.Empty;

        // Navigation property
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();

    }
}