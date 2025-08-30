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
    public class PropertyLookupRepository : IPropertyLookupRepository
    {
        private readonly ApplicationDbContext _context;

        public PropertyLookupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Currency>> FindCurrenciesAsync()
        {
            return await _context.Currencies.ToListAsync();
        }

        public async Task<List<PropertyStatus>> FindPropertyStatusesAsync()
        {
            return await _context.PropertyStatuses.ToListAsync();
        }

        public async Task<List<PropertyType>> FindPropertyTypesAsync()
        {
            return await _context.PropertyTypes.ToListAsync();
        }
    }
}