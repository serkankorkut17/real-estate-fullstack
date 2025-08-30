using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Services
{
  public class GeocodingService : IGeocodingService
  {
    private readonly HttpClient _httpClient;

    public GeocodingService(HttpClient httpClient)
    {
      _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
      _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("RealEstateApp/1.0");
    }

    // Get Latitude and Longitude from Address
    public async Task<CoordinatesDTO?> GetCoordinatesAsync(string address)
    {
      var url = $"https://nominatim.openstreetmap.org/search?format=json&q={Uri.EscapeDataString(address)}";
      var response = await _httpClient.GetStringAsync(url);

      var results = JsonSerializer.Deserialize<List<OsmResult>>(response);

      var first = results?.FirstOrDefault();
      if (first == null) return null;

      if (double.TryParse(first.Lat, out var lat) && double.TryParse(first.Lon, out var lon))
      {
        return new CoordinatesDTO
        {
          Latitude = lat,
          Longitude = lon
        };
      }

      return null;
    }

    public async Task<Location> UpdateLocationAsync(Location location)
    {
      // If coordinates are missing, fetch them using input address
      if (location.Latitude == null || location.Longitude == null)
      {
        var address = $"{location.Neighborhood}, {location.District}, {location.City}, {location.Country}";
        if (string.IsNullOrWhiteSpace(location.Neighborhood))
        {
          address = $"{location.District}, {location.City}, {location.Country}";
        }
        if (string.IsNullOrWhiteSpace(location.District))
        {
          address = $"{location.City}, {location.Country}";
        }
        if (string.IsNullOrWhiteSpace(location.City))
        {
          address = $"{location.Country}";
        }
        if (string.IsNullOrWhiteSpace(location.Country))
        {
          address = "Turkey";
        }

        var coordinates = await GetCoordinatesAsync(address);

        if (coordinates != null)
        {
          location.Latitude = coordinates.Latitude;
          location.Longitude = coordinates.Longitude;
        }
        else
        {
          // give istanbul as default coordinates
          location.Latitude = 41.0082;
          location.Longitude = 28.9784;
        }
      }
      return location;
    }

    private class OsmResult
    {
      public string Lat { get; set; } = null!;
      public string Lon { get; set; } = null!;
    }
  }

}