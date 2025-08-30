using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Property
{
    public class PropertyFilterDTO
    {
        // Basic Filters
        public string? SearchTerm { get; set; }
        public int? PropertyTypeId { get; set; }
        public int? PropertyStatusId { get; set; }

        // Price Filters
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? CurrencyId { get; set; }

        // Date Filters
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // Location Filters
        // public string? Country { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }

        // Property Details
        public int? MinGrossArea { get; set; }
        public int? MaxGrossArea { get; set; }
        public int? MinNetArea { get; set; }
        public int? MaxNetArea { get; set; }
        public string? RoomCount { get; set; }

        // Features
        public bool? HasKitchen { get; set; }
        public bool? HasBalcony { get; set; }
        public bool? HasElevator { get; set; }
        public bool? HasParking { get; set; }
        public bool? HasGarden { get; set; }
        public bool? IsFurnished { get; set; }
        public bool? IsInComplex { get; set; }
        public bool? IsEligibleForLoan { get; set; }
        public bool? IsExchangeable { get; set; }

        // Pagination
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sorting
        public string? SortBy { get; set; } = "CreatedDate";
        public string? SortDirection { get; set; } = "desc"; // asc, desc
    }
}