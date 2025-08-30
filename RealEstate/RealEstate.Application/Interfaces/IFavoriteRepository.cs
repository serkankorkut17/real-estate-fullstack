using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
  public interface IFavoriteRepository
  {
    Task<Favorite> AddAsync(Favorite favorite);
    Task<bool> DeleteAsync(int userId, int propertyId);
    Task<Favorite?> GetByUserIdAndPropertyId(int userId, int propertyId);
    Task<List<Property?>> GetAllByUserIdAsync(int userId);
  }
}