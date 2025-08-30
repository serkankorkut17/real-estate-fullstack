using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealEstate.Domain.Entities
{
  public class Location
  {
    public int Id { get; set; }

    public string? Country { get; set; } = "Türkiye";
    public string? City { get; set; }
    public string? District { get; set; }
    public string? Neighborhood { get; set; }
    public string? Street { get; set; }
    public string? AddressLine { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public Property? Property { get; set; }
    
    public override string ToString()
    {
      return $"Id: {Id}, Country: {Country}, City: {City}, District: {District}, Neighborhood: {Neighborhood}, Street: {Street}, AddressLine: {AddressLine}, Latitude: {Latitude}, Longitude: {Longitude}";
    }
  }

}