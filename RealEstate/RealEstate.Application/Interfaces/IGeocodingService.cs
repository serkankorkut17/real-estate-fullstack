using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Property;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IGeocodingService
    {
        Task<CoordinatesDTO?> GetCoordinatesAsync(string address);
        Task<Location> UpdateLocationAsync(Location location);
    }
}