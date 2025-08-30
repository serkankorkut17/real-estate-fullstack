using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
    public class PropertyStatus
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;

        // Navigation property
        [JsonIgnore]
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();

    }
}