using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;
using System.Security.Claims;
using Serilog;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        // Get Properties (optional filtering): /api/properties
        [HttpGet]
        public async Task<IActionResult> GetAllProperties([FromQuery] PropertyFilterDTO filter)
        {
            var result = await _propertyService.GetPropertiesAsync(filter);
            return Ok(result);
        }

        // Get a specific property by ID: /api/properties/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProperty(int id)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            if (property == null)
                return NotFound();

            return Ok(property);
        }

        // Get Specific User's properties: /api/properties/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserProperties(int userId)
        {
            var properties = await _propertyService.GetPropertiesByUserIdAsync(userId);
            return Ok(properties);
        }

        // Create a new property: /api/properties
        [HttpPost]
        [Consumes("multipart/form-data")]
        // [Authorize]
        public async Task<IActionResult> CreateProperty([FromForm] CreatePropertyDTO createDto, [FromForm] List<IFormFile>? images = null)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "1";
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }
            createDto.OwnerId = parsedUserId;

            try
            {
                // Create the property
                var property = await _propertyService.CreatePropertyAsync(createDto, images);
                if (property == null)
                    return BadRequest(new { message = "Property creation failed." });

                return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        // Update a property: /api/properties/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProperty(int id, [FromForm] UpdatePropertyDTO updateDto, [FromForm] List<IFormFile>? images = null)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            // Check if the user has permission to edit the property
            bool canEdit = await _propertyService.CanEditPropertyAsync(id, parsedUserId);
            if (!canEdit)
                return Forbid();

            // Update the property
            var updatedProperty = await _propertyService.UpdatePropertyAsync(id, updateDto, images);
            if (updatedProperty == null)
                return NotFound();

            return Ok(updatedProperty);
        }

        // Delete a property: /api/properties/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            // Check if the user has permission to edit the property
            bool canEdit = await _propertyService.CanEditPropertyAsync(id, parsedUserId);
            if (!canEdit)
                return Forbid();

            // Delete the property
            var result = await _propertyService.DeletePropertyAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // Delete media: /api/properties/{propertyId}/media/{id}
        [HttpDelete("{propertyId}/media/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMedia(int propertyId, int id)
        {
            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            // Check if the user has permission to edit the property
            bool canEdit = await _propertyService.CanEditPropertyAsync(propertyId, parsedUserId);
            if (!canEdit)
                return Forbid();

            // Delete media
            var result = await _propertyService.DeletePropertyMediaAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}