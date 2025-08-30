using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
  public class FavoriteRepository : IFavoriteRepository
  {
    private readonly ApplicationDbContext _context;
    public FavoriteRepository(ApplicationDbContext context)
    {
      _context = context;
    }
    public async Task<Favorite> AddAsync(Favorite favorite)
    {
      _context.Favorites.Add(favorite);
      await _context.SaveChangesAsync();
      return favorite;
    }

    public async Task<bool> DeleteAsync(int userId, int propertyId)
    {
      var favorite = await _context.Favorites
        .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);
      if (favorite == null) return false;

      _context.Favorites.Remove(favorite);
      await _context.SaveChangesAsync();
      return true;
    }

    public async Task<List<Property?>> GetAllByUserIdAsync(int userId)
    {
      var favorites = await _context.Favorites.Where(f => f.UserId == userId).ToListAsync();
      var properties = new List<Property?>();
      foreach (var favorite in favorites)
      {
        var property = await _context.Properties
          .Include(p => p.Type)
          .Include(p => p.Status)
          .Include(p => p.Currency)
          .Include(p => p.Location)
          .Include(p => p.Details)
          .Include(p => p.Media)
          .Include(p => p.Owner)
          .FirstOrDefaultAsync(p => p.Id == favorite.PropertyId);
        if (property != null)
        {
          properties.Add(property);
        }
      }
      return properties;
    }

    public Task<Favorite?> GetByUserIdAndPropertyId(int userId, int propertyId)
    {
      return _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);
    }
  }
}