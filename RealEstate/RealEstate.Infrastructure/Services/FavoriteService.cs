using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Services
{
  public class FavoriteService : IFavoriteService
  {
    private readonly IFavoriteRepository _repository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IMapper _mapper;
    public FavoriteService(IFavoriteRepository repository, IPropertyRepository propertyRepository, IMapper mapper)
    {
      _repository = repository;
      _propertyRepository = propertyRepository;
      _mapper = mapper;
    }

    public async Task<bool> AddToFavoritesAsync(int userId, int propertyId)
    {
      var favorite = new Favorite { UserId = userId, PropertyId = propertyId };
      return await _repository.AddAsync(favorite) != null;
    }

    public async Task<List<PropertyResponseDTO>> GetFavoritesAsync(int userId)
    {
      var favorites = await _repository.GetAllByUserIdAsync(userId);
      return _mapper.Map<List<PropertyResponseDTO>>(favorites);
    }

    public async Task<bool> RemoveFromFavoritesAsync(int userId, int propertyId)
    {
      return await _repository.DeleteAsync(userId, propertyId);
    }
  }
}