using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Admin;
using RealEstate.Application.DTOs.Property;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyRepository
    {
        Task<PagedResultDTO<PropertyResponseDTO>> FindAllAsync(PropertyFilterDTO filter);
        Task<List<Property>> FindByUserIdAsync(int userId);
        Task<Property?> FindByIdAsync(int id);
        Task<Property> SaveAsync(Property property);
        Task AddPropertyMediaAsync(int propertyId, List<PropertyMedia> media);
        Task<Property> UpdateAsync(Property property);
        Task<bool> DeleteAsync(int id);
        Task<int> CountAsync();
        Task<int> CountSaleAsync();
        Task<int> CountRentAsync();
        Task<List<PropertyTypeStatsDTO>> GetTypeStatsAsync();
        Task<List<MonthlyTrendDTO>> GetMonthlyTrendsAsync();
        Task<List<RecentActivityDTO>> GetRecentActivitiesAsync();
        Task<PropertyMedia?> FindMediaByIdAsync(int mediaId);
        Task<bool> DeleteMediaAsync(PropertyMedia media);
        Task<PropertyMedia?> GetOtherPrimaryMediaAsync(int propertyId, int excludeMediaId);
        Task<bool> UpdateMediaAsync(PropertyMedia media);
        Task<Location?>  SaveLocationAsync(Location location);
        Task<Location?>  UpdateLocationAsync(Location location);
        Task<Location?> GetLocationByIdAsync(int id);
        Task<PropertyDetails?> SavePropertyDetailsAsync(PropertyDetails details);
        Task<PropertyDetails?> UpdatePropertyDetailsAsync(PropertyDetails details);
        Task<PropertyDetails?> GetPropertyDetailsByIdAsync(int id);
    }
}