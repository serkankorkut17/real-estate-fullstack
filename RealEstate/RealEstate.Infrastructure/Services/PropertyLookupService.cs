using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;

namespace RealEstate.Infrastructure.Services
{
    public class PropertyLookupService : IPropertyLookupService
    {
        private readonly IPropertyLookupRepository _propertyLookupRepository;
        private readonly IMapper _mapper;

        public PropertyLookupService(IPropertyLookupRepository propertyLookupRepository, IMapper mapper)
        {
            _propertyLookupRepository = propertyLookupRepository;
            _mapper = mapper;
        }

        public async Task<List<CurrencyDTO>> GetCurrenciesAsync()
        {
            var currencies = await _propertyLookupRepository.FindCurrenciesAsync();
            return _mapper.Map<List<CurrencyDTO>>(currencies);
        }

        public async Task<List<PropertyStatusDTO>> GetPropertyStatusesAsync()
        {
            var statuses = await _propertyLookupRepository.FindPropertyStatusesAsync();
            return _mapper.Map<List<PropertyStatusDTO>>(statuses);
        }

        public async Task<List<PropertyTypeDTO>> GetPropertyTypesAsync()
        {
            var types = await _propertyLookupRepository.FindPropertyTypesAsync();
            return _mapper.Map<List<PropertyTypeDTO>>(types);
        }
    }
}