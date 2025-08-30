using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RealEstate.Application.DTOs.Admin;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Data;
using Microsoft.Extensions.Caching.Distributed;
using AutoMapper;

namespace RealEstate.Infrastructure.Repositories
{
  public class PropertyRepository : IPropertyRepository
  {
    private readonly ApplicationDbContext _context;
    private readonly IDistributedCache _cache;
    private readonly IMapper _mapper;
    private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
    {
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
      DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
      WriteIndented = false,
      ReferenceHandler = ReferenceHandler.IgnoreCycles,
      MaxDepth = 64
    };

    public PropertyRepository(ApplicationDbContext context, IDistributedCache cache, IMapper mapper)
    {
      _context = context;
      _cache = cache;
      _mapper = mapper;
    }

    // Add a new property
    public async Task<Property> SaveAsync(Property property)
    {
      _context.Properties.Add(property);
      await _context.SaveChangesAsync();

      // increment version
      await IncrementPropertiesVersionAsync();

      // cache single item
      var itemKey = GetPropertyKey(property.Id);
      await _cache.SetStringAsync(itemKey, JsonSerializer.Serialize(property, _jsonOptions),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12) });


      return property;
    }

    // Find all properties (with filters)
    public async Task<PagedResultDTO<PropertyResponseDTO>> FindAllAsync(PropertyFilterDTO filter)
    {
      // Try to get from cache first
      var version = await GetPropertiesVersionAsync();
      var filterKey = JsonSerializer.Serialize(filter, _jsonOptions);
      var cacheKey = $"properties:v{version}:{filterKey}";

      var cached = await _cache.GetStringAsync(cacheKey);
      if (!string.IsNullOrEmpty(cached))
      {
        return JsonSerializer.Deserialize<PagedResultDTO<PropertyResponseDTO>>(cached, _jsonOptions)!;
      }

      // DB Query
      var query = _context.Properties
          .Include(p => p.Type)
          .Include(p => p.Status)
          .Include(p => p.Currency)
          .Include(p => p.Location)
          .Include(p => p.Details)
          .Include(p => p.Owner)
          .Include(p => p.Media)
          .AsQueryable();

      // Basic Filters
      if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
      {
        var terms = filter.SearchTerm
          .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
          .Select(t => t.Trim().ToLower())
          .ToArray();

        foreach (var term in terms)
        {
          query = query.Where(p =>
            (p.Title != null && p.Title.ToLower().Contains(term)) ||
            (p.Description != null && p.Description.ToLower().Contains(term)) ||
            (p.Location != null && p.Location.City != null && p.Location.City.ToLower().Contains(term)) ||
            (p.Location != null && p.Location.District != null && p.Location.District.ToLower().Contains(term)) ||
            (p.Location != null && p.Location.Neighborhood != null && p.Location.Neighborhood.ToLower().Contains(term)) ||
            (p.Location != null && p.Location.Street != null && p.Location.Street.ToLower().Contains(term)) ||
            (p.Details != null && p.Details.RoomCount != null && p.Details.RoomCount.ToLower().Contains(term))
          );
        }
      }

      if (filter.PropertyTypeId.HasValue)
        query = query.Where(p => p.PropertyTypeId == filter.PropertyTypeId);

      if (filter.PropertyStatusId.HasValue)
        query = query.Where(p => p.PropertyStatusId == filter.PropertyStatusId);

      // Price Filters
      if (filter.MinPrice.HasValue)
        query = query.Where(p => p.Price >= filter.MinPrice);

      if (filter.MaxPrice.HasValue)
        query = query.Where(p => p.Price <= filter.MaxPrice);

      if (filter.CurrencyId.HasValue)
        query = query.Where(p => p.CurrencyId == filter.CurrencyId);

      // Date Filters
      if (filter.StartDate.HasValue)
        query = query.Where(p => p.StartDate >= filter.StartDate);

      if (filter.EndDate.HasValue)
        query = query.Where(p => p.EndDate <= filter.EndDate);

      // City Filter
      if (!string.IsNullOrEmpty(filter.City))
        query = query.Where(p => p.Location != null && p.Location.City != null && p.Location.City.Contains(filter.City));

      // District Filter
      if (!string.IsNullOrEmpty(filter.District))
        query = query.Where(p => p.Location != null && p.Location.District != null && p.Location.District.Contains(filter.District));

      // Gross Area Filters
      if (filter.MinGrossArea.HasValue)
        query = query.Where(p => p.Details != null && p.Details.GrossArea >= filter.MinGrossArea);

      if (filter.MaxGrossArea.HasValue)
        query = query.Where(p => p.Details != null && p.Details.GrossArea <= filter.MaxGrossArea);

      // Room Count Filter
      if (!string.IsNullOrEmpty(filter.RoomCount))
        query = query.Where(p => p.Details != null && p.Details.RoomCount != null && p.Details.RoomCount.Contains(filter.RoomCount));

      // Net Area Filters
      if (filter.MinNetArea.HasValue)
        query = query.Where(p => p.Details != null && p.Details.NetArea >= filter.MinNetArea);

      if (filter.MaxNetArea.HasValue)
        query = query.Where(p => p.Details != null && p.Details.NetArea <= filter.MaxNetArea);

      // Bool Filters
      if (filter.HasKitchen.HasValue && filter.HasKitchen.Value)
        query = query.Where(p => p.Details != null && p.Details.HasKitchen == true);

      if (filter.HasBalcony.HasValue && filter.HasBalcony.Value)
        query = query.Where(p => p.Details != null && p.Details.HasBalcony == true);

      if (filter.HasElevator.HasValue && filter.HasElevator.Value)
        query = query.Where(p => p.Details != null && p.Details.HasElevator == true);

      if (filter.HasParking.HasValue && filter.HasParking.Value)
        query = query.Where(p => p.Details != null && p.Details.HasParking == true);

      if (filter.HasGarden.HasValue && filter.HasGarden.Value)
        query = query.Where(p => p.Details != null && p.Details.HasGarden == true);

      if (filter.IsFurnished.HasValue && filter.IsFurnished.Value)
        query = query.Where(p => p.Details != null && p.Details.IsFurnished == true);

      if (filter.IsInComplex.HasValue && filter.IsInComplex.Value)
        query = query.Where(p => p.Details != null && p.Details.IsInComplex == true);

      if (filter.IsEligibleForLoan.HasValue && filter.IsEligibleForLoan.Value)
        query = query.Where(p => p.Details != null && p.Details.IsEligibleForLoan == true);

      if (filter.IsExchangeable.HasValue && filter.IsExchangeable.Value)
        query = query.Where(p => p.Details != null && p.Details.IsExchangeable == true);

      // Sorting
      query = filter.SortBy?.ToLower() switch
      {
        "price" => filter.SortDirection == "asc"
            ? query.OrderBy(p => p.Price)
            : query.OrderByDescending(p => p.Price),
        "area" => filter.SortDirection == "asc"
            ? query.OrderBy(p => p.Details != null ? p.Details.NetArea : 0)
            : query.OrderByDescending(p => p.Details != null ? p.Details.NetArea : 0),
        "createddate" => filter.SortDirection == "asc"
            ? query.OrderBy(p => p.CreatedDate)
            : query.OrderByDescending(p => p.CreatedDate),
        "title" => filter.SortDirection == "asc"
            ? query.OrderBy(p => p.Title)
            : query.OrderByDescending(p => p.Title),
        _ => query.OrderByDescending(p => p.CreatedDate)
      };


      var totalCount = await query.CountAsync();
      List<Property> properties;
      if (filter.PageSize <= 0)
      {
        properties = await query.ToListAsync();
      }
      else
      {
        properties = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();
      }

      var propertyResponses = _mapper.Map<List<PropertyResponseDTO>>(properties);

      var result = new PagedResultDTO<PropertyResponseDTO>
      {
        Data = propertyResponses,
        TotalCount = totalCount,
        Page = filter.Page,
        PageSize = filter.PageSize
      };

      // cache result
      await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(result, _jsonOptions),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1) });

      return result;
    }

    // Find properties by user ID
    public async Task<List<Property>> FindByUserIdAsync(int userId)
    {
      return await _context.Properties
          .Where(p => p.OwnerId == userId)
          .Include(p => p.Type)
          .Include(p => p.Status)
          .Include(p => p.Currency)
          .Include(p => p.Location)
          .Include(p => p.Details)
          .Include(p => p.Owner)
          .Include(p => p.Media)
          .ToListAsync();
    }

    // Find a property by its ID
    public async Task<Property?> FindByIdAsync(int id)
    {
      // Try to get from cache first
      var key = GetPropertyKey(id);
      var cached = await _cache.GetStringAsync(key);
      // if (!string.IsNullOrEmpty(cached))
      // {
      //   return JsonSerializer.Deserialize<Property>(cached, _jsonOptions);
      // }

      var property = await _context.Properties
          .Include(p => p.Type)
          .Include(p => p.Status)
          .Include(p => p.Currency)
          .Include(p => p.Location)
          .Include(p => p.Details)
          .Include(p => p.Owner)
          .Include(p => p.Media)
          .FirstOrDefaultAsync(p => p.Id == id);

      // Cache the result
      if (property != null)
      {
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(property, _jsonOptions),
          new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12) });
      }

      return property;
    }

    // Add media to a property
    public async Task AddPropertyMediaAsync(int propertyId, List<PropertyMedia> media)
    {
      // Set the PropertyId for each media item
      foreach (var item in media)
      {
        item.PropertyId = propertyId;
      }

      _context.PropertyMedias.AddRange(media);
      await _context.SaveChangesAsync();
    }

    // Delete an existing property
    public async Task<bool> DeleteAsync(int id)
    {
      var property = await _context.Properties.FindAsync(id);
      if (property == null) return false;

      _context.Properties.Remove(property);
      await _context.SaveChangesAsync();

      // remove item from cache and increment version
      var key = GetPropertyKey(id);
      await _cache.RemoveAsync(key);
      await IncrementPropertiesVersionAsync();

      return true;
    }

    // Update an existing property
    public async Task<Property> UpdateAsync(Property property)
    {
      _context.Properties.Update(property);
      await _context.SaveChangesAsync();

      // update item from cache
      var key = GetPropertyKey(property.Id);
      await _cache.SetStringAsync(key, JsonSerializer.Serialize(property, _jsonOptions),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12) });

      await IncrementPropertiesVersionAsync();

      return property;
    }

    // Count the total number of properties
    public async Task<int> CountAsync()
    {
      return await _context.Properties.CountAsync();
    }

    // Count the number of properties for sale
    public async Task<int> CountSaleAsync()
    {
      return await _context.Properties.CountAsync(p => p.PropertyStatusId == 1);
    }

    // Count the number of properties for rent
    public async Task<int> CountRentAsync()
    {
      return await _context.Properties.CountAsync(p => p.PropertyStatusId == 2);
    }

    // Statistics for Property Types
    public async Task<List<PropertyTypeStatsDTO>> GetTypeStatsAsync()
    {
      var totalProperties = await _context.Properties.CountAsync();

      var propertyTypes = await _context.PropertyTypes
          .Select(pt => new PropertyTypeStatsDTO
          {
            Name = pt.Name,
            Count = pt.Properties.Count(),
            Percentage = (double)pt.Properties.Count() / totalProperties * 100
          })
          .ToListAsync();

      return propertyTypes;
    }

    // Monthly Statistics for Properties according to their start date
    public async Task<List<MonthlyTrendDTO>> GetMonthlyTrendsAsync()
    {
      return await _context.Properties
          .GroupBy(p => new { p.StartDate.Year, p.StartDate.Month })
          .Select(g => new MonthlyTrendDTO
          {
            Month = g.Key.Month,
            Year = g.Key.Year,
            ForSale = g.Count(p => p.PropertyStatusId == 1),
            ForRent = g.Count(p => p.PropertyStatusId == 2)
          })
          .OrderBy(g => g.Year).ThenBy(g => g.Month)
          .ToListAsync();
    }

    // Latest created 5 properties
    public async Task<List<RecentActivityDTO>> GetRecentActivitiesAsync()
    {
      var recentActivities = await _context.Properties
          .OrderByDescending(p => p.CreatedDate)
          .Take(5)
          .Select(p => new RecentActivityDTO
          {
            Action = p.PropertyStatusId == 1 ? "Sale" : "Rent",
            Item = p.Title,
            Time = p.CreatedDate
          })
          .ToListAsync();

      return recentActivities;
    }

    // Find Media by Id
    public async Task<PropertyMedia?> FindMediaByIdAsync(int mediaId)
    {
      return await _context.PropertyMedias
          .FirstOrDefaultAsync(pm => pm.Id == mediaId);
    }

    // Delete Media
    public async Task<bool> DeleteMediaAsync(PropertyMedia media)
    {
      _context.PropertyMedias.Remove(media);
      return await _context.SaveChangesAsync() > 0;
    }

    // Get media from a property but exclude a specific media item
    public Task<PropertyMedia?> GetOtherPrimaryMediaAsync(int propertyId, int excludeMediaId)
    {
      return _context.PropertyMedias
          .Where(pm => pm.PropertyId == propertyId && pm.Id != excludeMediaId)
          .FirstOrDefaultAsync();
    }

    // Update Media
    public Task<bool> UpdateMediaAsync(PropertyMedia media)
    {
      _context.PropertyMedias.Update(media);
      return _context.SaveChangesAsync().ContinueWith(t => t.Result > 0);
    }

    public async Task<Location?> SaveLocationAsync(Location location)
    {
      _context.Locations.Add(location);
      await _context.SaveChangesAsync();
      return location;
    }

    public async Task<Location?> UpdateLocationAsync(Location location)
    {
      _context.Locations.Update(location);
      await _context.SaveChangesAsync();
      return location;
    }

    public async Task<PropertyDetails?> SavePropertyDetailsAsync(PropertyDetails details)
    {
      _context.PropertyDetails.Add(details);
      await _context.SaveChangesAsync();
      return details;
    }

    public async Task<PropertyDetails?> UpdatePropertyDetailsAsync(PropertyDetails details)
    {
      _context.PropertyDetails.Update(details);
      await _context.SaveChangesAsync();
      return details;
    }

    public async Task<Location?> GetLocationByIdAsync(int id)
    {
      return await _context.Locations
          .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<PropertyDetails?> GetPropertyDetailsByIdAsync(int id)
    {
      return await _context.PropertyDetails
          .FirstOrDefaultAsync(pd => pd.Id == id);
    }

    // REDIS: helper methods for cache keys and versioning
    private string GetPropertyKey(int id) => $"property:{id}";

    private async Task<string> GetPropertiesVersionAsync()
    {
      var v = await _cache.GetStringAsync("properties_version");
      if (string.IsNullOrEmpty(v))
      {
        v = "1";
        await _cache.SetStringAsync("properties_version", v);
      }
      return v;
    }

    private async Task IncrementPropertiesVersionAsync()
    {
      var v = await _cache.GetStringAsync("properties_version");
      var iv = 1;
      if (!string.IsNullOrEmpty(v) && int.TryParse(v, out var parsed)) iv = parsed + 1;
      await _cache.SetStringAsync("properties_version", iv.ToString());
    }
  }
}