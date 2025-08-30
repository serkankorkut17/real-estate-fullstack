using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Admin;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IAccountRepository
    {
        Task<bool> CreateUserAsync(ApplicationUser user, string password);
        Task<bool> UpdateUserAsync(ApplicationUser user);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<ApplicationUser?> FindUserByEmailAsync(string email);
        Task<ApplicationUser?> FindUserByIdAsync(int userId);
        Task<bool> CheckUserExistsAsync(string email);
        Task<bool> ChangePasswordAsync(ApplicationUser user, string currentPassword, string newPassword);
        Task<string?> GeneratePasswordResetTokenAsync(ApplicationUser user);
        Task<bool> ResetPasswordAsync(ApplicationUser user, string token, string newPassword);
        Task<List<string>> GetUserRoles(int userId);
        Task<bool> AddToRoleAsync(int userId, string role);
        Task<List<ApplicationUser>> GetAllAsync();
        Task<int> GetActiveUserCountAsync();
        Task<List<RecentActivityDTO>> GetRecentActivities();
    }
}