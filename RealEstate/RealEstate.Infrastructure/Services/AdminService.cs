using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Admin;
using RealEstate.Application.Interfaces;

namespace RealEstate.Infrastructure.Services
{
    public class AdminService : IAdminService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IAccountRepository _accountRepository;

        public AdminService(IPropertyRepository propertyRepository, IAccountRepository accountRepository)
        {
            _propertyRepository = propertyRepository;
            _accountRepository = accountRepository;
        }

        public async Task<List<UserWithRolesDTO>> GetAllUsersAsync()
        {
            // Retrieve all users with their roles
            var users = await _accountRepository.GetAllAsync();
            
            var userDtos = new List<UserWithRolesDTO>();
            foreach (var user in users)
            {
                var roles = await _accountRepository.GetUserRoles(user.Id);
                userDtos.Add(new UserWithRolesDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Roles = roles
                });
            }

            return userDtos;
        }

        // Data for Admin Dashboard
        public async Task<DashboardDTO> GetDashboardDataAsync()
        {
            var totalProperties = await _propertyRepository.CountAsync();
            var forSaleProperties = await _propertyRepository.CountSaleAsync();
            var forRentProperties = await _propertyRepository.CountRentAsync();
            var activeUsers = await _accountRepository.GetActiveUserCountAsync();

            // Statistics for Property Types
            var propertyTypeStats = await _propertyRepository.GetTypeStatsAsync();

            // Monthly Stats for Properties
            var monthlyTrends = await _propertyRepository.GetMonthlyTrendsAsync();
            var datasets = new List<ChartDatasetDTO>
            {
                new ChartDatasetDTO
                {
                    Label = "For Sale",
                    Data = monthlyTrends.Select(mt => mt.ForSale).ToList()
                },
                new ChartDatasetDTO
                {
                    Label = "For Rent",
                    Data = monthlyTrends.Select(mt => mt.ForRent).ToList()
                }
            };

            // Get Recent Activities
            var recentPropertyActivities = await _propertyRepository.GetRecentActivitiesAsync();
            var recentUserActivities = await _accountRepository.GetRecentActivities();

            var recentActivities = recentPropertyActivities.Concat(recentUserActivities).ToList();
            recentActivities.Sort((x, y) => y.Time.CompareTo(x.Time));

            return new DashboardDTO
            {
                TotalProperties = totalProperties,
                ForSaleProperties = forSaleProperties,
                ForRentProperties = forRentProperties,
                ActiveUsers = activeUsers,
                PropertyTypeStats = propertyTypeStats,
                ChartData = new ChartDataDTO
                {
                    Datasets = datasets,
                    Labels = monthlyTrends.Select(mt => $"{mt.Month}/{mt.Year}").ToList()
                },
                RecentActivities = recentActivities
            };
        }

        public async Task<bool> GrantAdminAccessAsync(int userId)
        {
            // Logic to grant admin access to a user
            var userRoles = await _accountRepository.GetUserRoles(userId);
            if (userRoles.Contains("Admin"))
                return false;

            return await _accountRepository.AddToRoleAsync(userId, "Admin");
        }
    }
}