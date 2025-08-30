using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Property
{
    public class UpdatePropertyDTO
    {
        public string? Title { get; set; } = null;
        public string? Description { get; set; } = null;
        public int? PropertyTypeId { get; set; } = null;
        public int? PropertyStatusId { get; set; } = null;
        public string? Country { get; set; } = null;
        public string? City { get; set; } = null;
        public string? District { get; set; } = null;
        public string? Neighborhood { get; set; } = null;
        public string? Street { get; set; } = null;
        public string? AddressLine { get; set; } = null;
        public double? Latitude { get; set; } = null;
        public double? Longitude { get; set; } = null;
        public decimal? Price { get; set; } = null;
        public int? CurrencyId { get; set; } = null;
        public decimal? Deposit { get; set; } = null;
        public decimal? MonthlyFee { get; set; } = null;
        public int? GrossArea { get; set; } = null;
        public int? NetArea { get; set; } = null;
        public string? RoomCount { get; set; } = null;
        public int? BuildingAge { get; set; } = null;
        public int? FloorNumber { get; set; } = null;
        public int? TotalFloors { get; set; } = null;
        public int? BathroomCount { get; set; } = null;
        public string? HeatingType { get; set; } = null;
        public bool? HasKitchen { get; set; } = null;
        public bool? HasBalcony { get; set; } = null;
        public bool? HasElevator { get; set; } = null;
        public bool? HasParking { get; set; } = null;
        public bool? HasGarden { get; set; } = null;
        public bool? IsFurnished { get; set; } = null;
        public string? UsageStatus { get; set; } = null;
        public bool? IsInComplex { get; set; } = null;
        public bool? IsEligibleForLoan { get; set; } = null;
        public string? DeedStatus { get; set; } = null;
        public string? ListedBy { get; set; } = null;
        public bool? IsExchangeable { get; set; } = null;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}