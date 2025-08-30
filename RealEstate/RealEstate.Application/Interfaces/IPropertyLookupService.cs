using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Property;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyLookupService
    {
        Task<List<PropertyTypeDTO>> GetPropertyTypesAsync();
        Task<List<PropertyStatusDTO>> GetPropertyStatusesAsync();
        Task<List<CurrencyDTO>> GetCurrenciesAsync();
    }
}