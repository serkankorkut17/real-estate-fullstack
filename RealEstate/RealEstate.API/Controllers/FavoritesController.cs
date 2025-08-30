using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.Interfaces;

namespace RealEstate.API.Controllers
{
    [ApiController]
    // [Authorize]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost("{propertyId}")]
        public async Task<IActionResult> AddToFavorites(int propertyId)
        {
            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "1";
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            var result = await _favoriteService.AddToFavoritesAsync(parsedUserId, propertyId);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("{propertyId}")]
        public async Task<IActionResult> RemoveFromFavorites(int propertyId)
        {
            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "1";
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            var result = await _favoriteService.RemoveFromFavoritesAsync(parsedUserId, propertyId);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            // Get user id from claims
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "1";
            if (!int.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            var favorites = await _favoriteService.GetFavoritesAsync(parsedUserId);
            return Ok(favorites);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFavoritesByUserId(int userId)
        {
            var favorites = await _favoriteService.GetFavoritesAsync(userId);
            return Ok(favorites);
        }
    }
}