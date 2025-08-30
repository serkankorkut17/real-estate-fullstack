using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.Interfaces;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyLookupController : ControllerBase
    {
        private readonly IPropertyLookupService _propertyLookupService;

        public PropertyLookupController(IPropertyLookupService propertyLookupService)
        {
            _propertyLookupService = propertyLookupService;
        }

        // GET /api/property-lookup/types - PropertyType list
        [HttpGet("types")]
        public async Task<IActionResult> GetPropertyTypes()
        {
            var propertyTypes = await _propertyLookupService.GetPropertyTypesAsync();
            return Ok(propertyTypes);
        }

        // GET /api/property-lookup/statuses - PropertyStatus list
        [HttpGet("statuses")]
        public async Task<IActionResult> GetPropertyStatuses()
        {
            var propertyStatuses = await _propertyLookupService.GetPropertyStatusesAsync();
            return Ok(propertyStatuses);
        }

        // GET /api/property-lookup/currencies - Currency list
        [HttpGet("currencies")]
        public async Task<IActionResult> GetCurrencies()
        {
            var currencies = await _propertyLookupService.GetCurrenciesAsync();
            return Ok(currencies);
        }
    }
}