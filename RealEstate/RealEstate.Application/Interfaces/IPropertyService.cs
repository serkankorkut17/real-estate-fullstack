using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Property;
using Microsoft.AspNetCore.Http;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<PagedResultDTO<PropertyResponseDTO>> GetPropertiesAsync(PropertyFilterDTO filter);
        Task<PropertyResponseDTO?> GetPropertyByIdAsync(int id);
        Task<List<PropertyResponseDTO>> GetPropertiesByUserIdAsync(int userId);
        Task<PropertyResponseDTO?> CreatePropertyAsync(CreatePropertyDTO createDto, List<IFormFile>? images = null);
        Task<PropertyResponseDTO?> UpdatePropertyAsync(int id, UpdatePropertyDTO updateDto, List<IFormFile>? images = null);
        Task<bool> DeletePropertyAsync(int id);
        Task<bool> CanEditPropertyAsync(int propertyId, int userId);
        Task<bool> DeletePropertyMediaAsync(int mediaId);
    }
}