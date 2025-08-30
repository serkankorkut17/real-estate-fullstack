using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
    public class PropertyDetails
    {
        public int Id { get; set; }
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

        // optional backref
        public virtual Property? Property { get; set; }


        public override string ToString()
        {
            return $"Id: {Id}, GrossArea: {GrossArea}, NetArea: {NetArea}, RoomCount: {RoomCount}, BuildingAge: {BuildingAge}, FloorNumber: {FloorNumber}, TotalFloors: {TotalFloors}, BathroomCount: {BathroomCount}, HeatingType: {HeatingType}, HasKitchen: {HasKitchen}, HasBalcony: {HasBalcony}, HasElevator: {HasElevator}, HasParking: {HasParking}, HasGarden: {HasGarden}, IsFurnished: {IsFurnished}, UsageStatus: {UsageStatus}, IsInComplex: {IsInComplex}, IsEligibleForLoan: {IsEligibleForLoan}, DeedStatus: {DeedStatus}, ListedBy: {ListedBy}, IsExchangeable: {IsExchangeable}";
        }
    }
}