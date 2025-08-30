using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Property
{
    public class PropertyResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Type and Status
        public int PropertyTypeId { get; set; }
        public PropertyTypeDTO? Type { get; set; }
        public int PropertyStatusId { get; set; }
        public PropertyStatusDTO? Status { get; set; }

        // Location
        public int? LocationId { get; set; }
        public LocationDTO? Location { get; set; }

        public decimal Price { get; set; }
        public int CurrencyId { get; set; }
        public CurrencyDTO? Currency { get; set; }
        public decimal? Deposit { get; set; }
        public decimal? MonthlyFee { get; set; }

        // Property Details
        public int? PropertyDetailsId { get; set; }
        public PropertyDetailsDTO? Details { get; set; }

        // Media
        public List<PropertyMediaDTO> Media { get; set; } = new();

        // Owner
        public int OwnerId { get; set; }
        public UserDTO? Owner { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}