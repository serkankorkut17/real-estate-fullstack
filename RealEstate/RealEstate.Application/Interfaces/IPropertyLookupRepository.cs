using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IPropertyLookupRepository
    {
        Task<List<PropertyType>> FindPropertyTypesAsync();
        Task<List<PropertyStatus>> FindPropertyStatusesAsync();
        Task<List<Currency>> FindCurrenciesAsync();
    }
}