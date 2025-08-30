using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstate.Application.DTOs.Admin;

namespace RealEstate.Application.Interfaces
{
    public interface IAdminService
    {
        Task<DashboardDTO> GetDashboardDataAsync();
        Task<bool> GrantAdminAccessAsync(int userId);
        Task<List<UserWithRolesDTO>> GetAllUsersAsync();
    }
}