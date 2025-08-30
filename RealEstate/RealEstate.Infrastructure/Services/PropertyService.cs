using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;

namespace RealEstate.Infrastructure.Services
{
  public class PropertyService : IPropertyService
  {
    private readonly IPropertyRepository _repository;
    private readonly IAccountRepository _accountRepository;
    private readonly IMapper _mapper;
    private readonly IFileService _fileService;
    private readonly IGeocodingService _geocodingService;

    public PropertyService(IPropertyRepository repository, IAccountRepository accountRepository, IMapper mapper, IFileService fileService, IGeocodingService geocodingService)
    {
      _repository = repository;
      _accountRepository = accountRepository;
      _mapper = mapper;
      _fileService = fileService;
      _geocodingService = geocodingService;
    }

    // Create a new property
    public async Task<PropertyResponseDTO?> CreatePropertyAsync(CreatePropertyDTO createDto, List<IFormFile>? images = null)
    {
      var location = _mapper.Map<Location>(createDto);
      location = await _geocodingService.UpdateLocationAsync(location);
      location = await _repository.SaveLocationAsync(location);
      if (location == null)
        throw new Exception("Location could not be saved and is null.");

      var details = _mapper.Map<PropertyDetails>(createDto);
      details = await _repository.SavePropertyDetailsAsync(details);
      if (details == null)
        throw new Exception("Property details could not be saved and is null.");

      var property = _mapper.Map<Property>(createDto);
      property.LocationId = location.Id;
      property.PropertyDetailsId = details.Id;

      property = await _repository.SaveAsync(property);

      // Upload images if provided
      if (images != null && images.Count != 0)
      {
        await UploadPropertyImagesAsync(property.Id, images);
      }

      // Pull the property again (with media)
      var propertyWithMedia = await _repository.FindByIdAsync(property.Id);
      if (propertyWithMedia == null)
        return null;
      return _mapper.Map<PropertyResponseDTO>(propertyWithMedia);
    }

    public async Task UploadPropertyImagesAsync(int propertyId, List<IFormFile> images, bool hasPrimary = false)
    {
      try
      {
        // Upload to Cloudinary
        var imageUrls = await _fileService.UploadMultipleImagesAsync(images, "properties");

        // Create and save PropertyMedia
        var propertyMediaList = new List<PropertyMedia>();

        for (int i = 0; i < imageUrls.Count; i++)
        {
          var propertyMedia = new PropertyMedia
          {
            PropertyId = propertyId,
            FileName = Path.GetFileName(images[i].FileName),
            Url = imageUrls[i],
            Type = MediaTypeEnum.Image,
            IsPrimary = !hasPrimary && i == 0, // Set first image as primary if none is set
            CreatedDate = DateTime.UtcNow
          };
          propertyMediaList.Add(propertyMedia);
        }

        // Save the media to the database
        await _repository.AddPropertyMediaAsync(propertyId, propertyMediaList);

      }
      catch (Exception ex)
      {
        throw new Exception($"Image upload failed: {ex.Message}");
      }
    }

    // Update an existing property
    public async Task<PropertyResponseDTO?> UpdatePropertyAsync(int id, UpdatePropertyDTO updateDto, List<IFormFile>? images = null)
    {
      var property = await _repository.FindByIdAsync(id);
      if (property == null)
        return null;

      var location = await _repository.GetLocationByIdAsync(property.LocationId ?? 0);
      if (location == null)
        return null;

      _mapper.Map(updateDto, location);


      if (updateDto.PropertyStatusId == null || updateDto.PropertyStatusId <= 0)
      {
        updateDto.PropertyStatusId = property.PropertyStatusId;
      }
      if (updateDto.PropertyTypeId == null || updateDto.PropertyTypeId <= 0)
      {
        updateDto.PropertyTypeId = property.PropertyTypeId;
      }
      if (updateDto.CurrencyId == null || updateDto.CurrencyId <= 0)
      {
        updateDto.CurrencyId = property.CurrencyId;
      }

      if (updateDto.StartDate == null)
      {
        updateDto.StartDate = property.StartDate;
      }

      if (updateDto.EndDate == null)
      {
        updateDto.EndDate = property.EndDate;
      }

      // Map the updated values
      _mapper.Map(updateDto, property);
      property = await _repository.UpdateAsync(property);

      var media = property.Media;
      bool hasPrimary = media.Any(m => m.IsPrimary);

      // Upload images if provided
      if (images != null && images.Count != 0)
      {
        await UploadPropertyImagesAsync(property.Id, images, hasPrimary);
      }

      // Pull the property again (with media)
      property = await _repository.FindByIdAsync(property.Id);
      if (property == null)
        return null;
      return _mapper.Map<PropertyResponseDTO>(property);
    }

    // Delete a property by its ID and related media
    public async Task<bool> DeletePropertyAsync(int id)
    {
      var property = await _repository.FindByIdAsync(id);
      if (property == null)
        return false;

      // Delete property media
      foreach (var media in property.Media)
      {
        var mediaUrl = media?.Url;
        if (!string.IsNullOrWhiteSpace(mediaUrl))
        {
          await _fileService.DeleteImageAsync(mediaUrl);
          // await _repository.DeleteMediaAsync(media);
        }
      }

      return await _repository.DeleteAsync(id);
    }

    // Get all properties with pagination and filtering
    public async Task<PagedResultDTO<PropertyResponseDTO>> GetPropertiesAsync(PropertyFilterDTO filter)
    {
      var properties = await _repository.FindAllAsync(filter);
      if (properties == null || properties.Data.Count == 0)
      {
        return new PagedResultDTO<PropertyResponseDTO>
        {
          Data = new List<PropertyResponseDTO>(),
          TotalCount = 0,
          Page = filter.Page,
          PageSize = filter.PageSize
        };
      }

      // Map the properties to DTOs
      // var propertyDtos = properties.Data.Select(p => _mapper.Map<PropertyResponseDTO>(p)).ToList();
      // return new PagedResultDTO<PropertyResponseDTO>
      // {
      //   Data = propertyDtos,
      //   TotalCount = properties.TotalCount,
      //   Page = filter.Page,
      //   PageSize = filter.PageSize
      // };
      return properties;
    }

    // Get a property by its ID
    public async Task<PropertyResponseDTO?> GetPropertyByIdAsync(int id)
    {
      if (id <= 0)
        return null;

      var property = await _repository.FindByIdAsync(id);
      return property == null ? null : _mapper.Map<PropertyResponseDTO>(property);
    }

    // Get properties by user ID
    public async Task<List<PropertyResponseDTO>> GetPropertiesByUserIdAsync(int userId)
    {
      var properties = await _repository.FindByUserIdAsync(userId);
      return properties.Select(p => _mapper.Map<PropertyResponseDTO>(p)).ToList();
    }

    // Check if the user can edit the property
    public async Task<bool> CanEditPropertyAsync(int propertyId, int userId)
    {
      var property = await _repository.FindByIdAsync(propertyId);
      if (property == null)
        return false;

      var userRoles = await _accountRepository.GetUserRoles(userId);
      var isAdmin = userRoles.Contains("Admin");
      var isOwner = property.OwnerId == userId;

      return isAdmin || isOwner;
    }

    // Delete property media from its id
    public async Task<bool> DeletePropertyMediaAsync(int mediaId)
    {
      var media = await _repository.FindMediaByIdAsync(mediaId);
      var mediaUrl = media?.Url;

      if (media == null)
        return false;

      if (media.IsPrimary)
      {
        // If the media is primary, set another media as primary if it exists
        var otherMedia = await _repository.GetOtherPrimaryMediaAsync(media.PropertyId, mediaId);
        // Console.WriteLine($"Text: {otherMedia?.Id}");
        if (otherMedia != null)
        {
          otherMedia.IsPrimary = true;
          await _repository.UpdateMediaAsync(otherMedia);
        }
      }

      await _repository.DeleteMediaAsync(media);
      // Delete the image from Cloudinary
      if (!string.IsNullOrWhiteSpace(mediaUrl))
      {
        await _fileService.DeleteImageAsync(mediaUrl);
      }
      return true;
    }
  }
}