using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RealEstate.Application.DTOs.Admin;
using RealEstate.Application.Interfaces;
using RealEstate.Domain.Entities;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
  public class AccountRepository : IAccountRepository
  {
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountRepository(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
      _context = context;
      _userManager = userManager;
    }

    // Check user password for login
    public Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
    {
      return _userManager.CheckPasswordAsync(user, password);
    }

    // Check if user already exists
    public async Task<bool> CheckUserExistsAsync(string email)
    {
      return await _context.Users.AnyAsync(u => u.Email == email);
    }

    // Create a new user
    public async Task<bool> CreateUserAsync(ApplicationUser user, string password)
    {
      var result = await _userManager.CreateAsync(user, password);
      // Assign the new user to default user role
      if (result.Succeeded)
      {
        await _userManager.AddToRoleAsync(user, "User");
      }
      return result.Succeeded;
    }

    // Find a user by email
    public async Task<ApplicationUser?> FindUserByEmailAsync(string email)
    {
      return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    // Find a user by ID
    public async Task<ApplicationUser?> FindUserByIdAsync(int userId)
    {
      return await _userManager.FindByIdAsync(userId.ToString());
    }

    // Get user roles by user ID
    public async Task<List<string>> GetUserRoles(int userId)
    {
      var user = await _context.Users.FindAsync(userId);
      if (user == null)
        return new List<string>();

      var roles = await _userManager.GetRolesAsync(user);
      var rolesList = roles.ToList();

      return rolesList;
    }

    // Change user password with a new one
    public async Task<bool> ChangePasswordAsync(ApplicationUser user, string currentPassword, string newPassword)
    {
      var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
      return result.Succeeded;
    }

    // Generate a password reset token
    public async Task<string?> GeneratePasswordResetTokenAsync(ApplicationUser user)
    {
      return await _userManager.GeneratePasswordResetTokenAsync(user);
    }

    // User password reset with a new password
    public async Task<bool> ResetPasswordAsync(ApplicationUser user, string token, string newPassword)
    {
      var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
      return result.Succeeded;
    }

    // Count the total number of users
    public Task<int> GetActiveUserCountAsync()
    {
      return _context.Users.CountAsync();
    }

    // Latest Created 5 Users
    public Task<List<RecentActivityDTO>> GetRecentActivities()
    {
      return _context.Users
          .Select(u => new RecentActivityDTO
          {
            Action = "User Signup",
            Item = $"{u.FirstName} {u.LastName}",
            Time = u.CreatedDate

          })
          .OrderByDescending(a => a.Time)
          .Take(5)
          .ToListAsync();
    }

    public async Task<bool> AddToRoleAsync(int userId, string role)
    {
      var user = await _context.Users.FindAsync(userId);
      if (user == null)
        return false;

      var result = await _userManager.AddToRoleAsync(user, role);
      return result.Succeeded;
    }

    public async Task<List<ApplicationUser>> GetAllAsync()
    {
      return await _context.Users.ToListAsync();
    }

    public async Task<bool> UpdateUserAsync(ApplicationUser user)
    {
      _context.Users.Update(user);
      return await _context.SaveChangesAsync() > 0;
    }
  }
}