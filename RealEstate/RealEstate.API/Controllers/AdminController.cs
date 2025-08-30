using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using RealEstate.Application.DTOs.Property;
using RealEstate.Application.Interfaces;
using System.Security.Claims;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardData()
        {
            // Retrieve dashboard data
            var dashboardData = await _adminService.GetDashboardDataAsync();
            return Ok(dashboardData);
        }

        // Get all users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        // Give admin access to specific user
        [HttpPost("users/{userId}")]
        public async Task<IActionResult> GrantAdminAccess(int userId)
        {
            var result = await _adminService.GrantAdminAccessAsync(userId);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}