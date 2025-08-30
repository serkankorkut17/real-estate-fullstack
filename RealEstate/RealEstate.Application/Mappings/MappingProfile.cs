using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using RealEstate.Application.DTOs;
using RealEstate.Application.DTOs.Account;
using RealEstate.Application.DTOs.Property;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Mappings
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      // Entity to DTO Mapping
      CreateMap<Currency, CurrencyDTO>();
      CreateMap<Location, LocationDTO>();
      CreateMap<PropertyDetails, PropertyDetailsDTO>();
      CreateMap<PropertyMedia, PropertyMediaDTO>()
          .ForMember(dest => dest.MediaType, opt => opt.MapFrom(src => src.Type.ToString()));
      CreateMap<PropertyStatus, PropertyStatusDTO>();
      CreateMap<PropertyType, PropertyTypeDTO>();
      CreateMap<ApplicationUser, UserDTO>();
      CreateMap<Property, PropertyResponseDTO>();
      CreateMap<Favorite, FavoriteDTO>();
      CreateMap<ApplicationUser, UserResponseDTO>();

      // DTO to Entity Mapping
      CreateMap<CreatePropertyDTO, PropertyDetails>();
      CreateMap<CreatePropertyDTO, Location>();
      CreateMap<CreatePropertyDTO, Property>()
          .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
          .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate ?? DateTime.UtcNow));

      // Update Property Mapping
      CreateMap<UpdatePropertyDTO, PropertyDetails>()
          .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
      CreateMap<UpdatePropertyDTO, Location>()
          .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
      CreateMap<UpdatePropertyDTO, Property>()
          .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));


      // User Signup Mapping
      CreateMap<RegisterRequestDTO, ApplicationUser>()
          .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
          .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(_ => DateTime.UtcNow));

      // User Login Mapping
      CreateMap<ApplicationUser, LoginResponseDTO>()
          .ForMember(dest => dest.Token, opt => opt.MapFrom((src, dest, destMember, context) =>
              context.Items.ContainsKey("Token") ? context.Items["Token"] : null))
          .ForMember(dest => dest.Expiration, opt => opt.MapFrom((src, dest, destMember, context) =>
              context.Items.ContainsKey("Expiration") ? context.Items["Expiration"] : DateTime.UtcNow.AddHours(7)));
      // var response = _mapper.Map<LoginResponseDTO>(user, opt => opt.Items["Token"] = token);



      // Specific PagedResult mapping for Property
      CreateMap<PagedResultDTO<Property>, PagedResultDTO<PropertyResponseDTO>>()
          .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.Data))
          .ForMember(dest => dest.TotalCount, opt => opt.MapFrom(src => src.TotalCount))
          .ForMember(dest => dest.Page, opt => opt.MapFrom(src => src.Page))
          .ForMember(dest => dest.PageSize, opt => opt.MapFrom(src => src.PageSize));



    }
  }
}