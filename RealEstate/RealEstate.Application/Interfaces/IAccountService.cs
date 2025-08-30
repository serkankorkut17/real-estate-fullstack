using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RealEstate.Application.DTOs.Account;
using RealEstate.Application.DTOs.Property;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Interfaces
{
    public interface IAccountService
    {
        Task<bool> RegisterUserAsync(RegisterRequestDTO registerRequest);
        Task<bool> UpdateUserProfileAsync(int userId, UpdateUserDTO dto, IFormFile? imageFile = null);
        Task<LoginResponseDTO> AuthenticateUserAsync(LoginRequestDTO loginRequest);
        Task<TokenResultDTO> GenerateToken(ApplicationUser user);
        Task<bool> ChangeUserPasswordAsync(int userId, string currentPassword, string newPassword);
        Task<bool> ForgotPasswordAsync(ForgotPasswordDTO dto);
        Task<bool> ResetUserPasswordAsync(ResetPasswordDTO dto);
        Task<UserResponseDTO> ValidateUserAsync(int userId);
    }
}