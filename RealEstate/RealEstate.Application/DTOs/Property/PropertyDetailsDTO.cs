using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Application.DTOs.Property
{
  public class PropertyDetailsDTO
  {
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
  }
}