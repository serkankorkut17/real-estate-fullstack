using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Property;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
  public interface IFavoriteService
  {
    Task<List<PropertyResponseDTO>> GetFavoritesAsync(int userId);
    Task<bool> RemoveFromFavoritesAsync(int userId, int propertyId);
    Task<bool> AddToFavoritesAsync(int userId, int propertyId);
  }
}