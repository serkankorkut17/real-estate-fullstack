using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Property
{
  public class CreatePropertyDTO
  {
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters.")]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required(ErrorMessage = "Property Type ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Property Type ID must be a positive integer.")]
    public int PropertyTypeId { get; set; }
    [Required(ErrorMessage = "Property Status ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Property Status ID must be a positive integer.")]
    public int PropertyStatusId { get; set; }
    public string? Country { get; set; } = "Türkiye";
    public string? City { get; set; }
    public string? District { get; set; }
    public string? Neighborhood { get; set; }
    public string? Street { get; set; }
    public string? AddressLine { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    [Required(ErrorMessage = "Price is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be a non-negative number.")]
    public decimal Price { get; set; }
    [Required(ErrorMessage = "Currency ID is required.")]
    public int CurrencyId { get; set; }
    public decimal? Deposit { get; set; }
    public decimal? MonthlyFee { get; set; }
    public int? GrossArea { get; set; }
    public int? NetArea { get; set; }
    public string? RoomCount { get; set; }
    public int? BuildingAge { get; set; }
    public int? FloorNumber { get; set; }
    public int? TotalFloors { get; set; }
    public int? BathroomCount { get; set; }
    public string? HeatingType { get; set; }
    public bool? HasKitchen { get; set; }
    public bool? HasBalcony { get; set; }
    public bool? HasElevator { get; set; }
    public bool? HasParking { get; set; }
    public bool? HasGarden { get; set; }
    public bool? IsFurnished { get; set; }
    public string? UsageStatus { get; set; }

    public bool? IsInComplex { get; set; }

    public bool? IsEligibleForLoan { get; set; }

    public string? DeedStatus { get; set; }
    public string? ListedBy { get; set; }
    public bool? IsExchangeable { get; set; }
    public int? OwnerId { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
  }
}